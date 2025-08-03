import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  NgZone,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import * as tmImage from '@teachablemachine/image';
import { HerramientaService } from '../servicios/herramienta.service';
import { HistorialService } from '../servicios/historial.service';

interface Prediction {
  className: string;
  probability: number;
}

@Component({
  selector: 'app-escaner',
  standalone: true,
  imports: [CommonModule, NgClass, RouterModule],
  templateUrl: './escaner.html',
  styleUrls: ['./escaner.css']
})
export class EscanerComponent implements OnInit, OnDestroy {
  private readonly MODEL_URL = 'https://teachablemachine.withgoogle.com/models/5L8ADLfMp/model.json';
  private readonly METADATA_URL = 'https://teachablemachine.withgoogle.com/models/5L8ADLfMp/metadata.json';
  private readonly PREDICTION_THRESHOLD = 0.95;
  private readonly IGNORED_CLASSES = ['background', 'desconocido'];

  @ViewChild('webcamContainer', { static: true }) webcamContainer!: ElementRef;

  private model!: tmImage.CustomMobileNet;
  private webcam!: tmImage.Webcam;
  private animationFrameId: number | null = null;
  private predictionIntervalId: any | null = null;

  public statusMessage: string | null = 'Cargando modelo...';
  public herramientaDetectada: Prediction | null = null;

  private confirmacionTimer: any = null;
  private herramientaPendiente: string | null = null;

  constructor(
    private zone: NgZone,
    private router: Router,
    private herramientaService: HerramientaService,
    private historialService: HistorialService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    try {
      this.model = await tmImage.load(this.MODEL_URL, this.METADATA_URL);
      this.statusMessage = 'Modelo cargado. Iniciando cámara...';
      this.cdr.detectChanges();

      this.webcam = new tmImage.Webcam(400, 400, true);
      await this.webcam.setup({ facingMode: 'environment' });
      await this.webcam.play();
      this.webcamContainer.nativeElement.appendChild(this.webcam.canvas);

      this.statusMessage = '¡Listo! Apunta a la herramienta.';
      this.cdr.detectChanges();

      this.startRenderLoop();
      this.startPredictionLoop();
    } catch (e: any) {
      console.error('Error al iniciar la webcam o cargar el modelo:', e);
      this.statusMessage = 'No se pudo iniciar la cámara. Asegúrate de dar permisos y refresca la página.';
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.predictionIntervalId) {
      clearInterval(this.predictionIntervalId);
    }
    if (this.confirmacionTimer) {
      clearTimeout(this.confirmacionTimer);
    }
    if (this.webcam) {
      this.webcam.stop();
      this.webcamContainer.nativeElement.innerHTML = '';
    }
  }

  private startRenderLoop() {
    const loop = () => {
      this.webcam?.update();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  private startPredictionLoop() {
    this.statusMessage = null;
    this.predictionIntervalId = setInterval(() => this.predict(), 300);
  }

  private async predict() {
    if (!this.webcam?.canvas) return;
    const predictions = await this.model.predict(this.webcam.canvas);

    const bestPrediction = predictions.reduce((max, pred) =>
      pred.probability > max.probability ? pred : max, predictions[0]);

    const esValida =
      bestPrediction.probability > this.PREDICTION_THRESHOLD &&
      !this.IGNORED_CLASSES.includes(bestPrediction.className.toLowerCase());

    this.zone.run(() => {
      const nueva = esValida ? bestPrediction : null;

      if (this.herramientaDetectada?.className !== nueva?.className) {
        this.herramientaDetectada = nueva;
        this.cdr.detectChanges();

        if (nueva) this.iniciarConfirmacionConRetardo(nueva.className);
        else {
          if (this.confirmacionTimer) clearTimeout(this.confirmacionTimer);
          this.confirmacionTimer = null;
          this.herramientaPendiente = null;
        }
      }
    });
  }

  private iniciarConfirmacionConRetardo(nombre: string) {
    if (this.herramientaPendiente !== nombre) {
      this.herramientaPendiente = nombre;
      if (this.confirmacionTimer) clearTimeout(this.confirmacionTimer);

      this.confirmacionTimer = setTimeout(() => {
        if (this.herramientaDetectada?.className === nombre) {
          this.onConfirmarHerramienta(nombre);
        }
        this.confirmacionTimer = null;
        this.herramientaPendiente = null;
      }, 2000);
    }
  }

  private onConfirmarHerramienta(nombre: string) {
    this.herramientaService.getHerramientaPorNombre(nombre.trim()).subscribe({
      next: (data) => {
        if (data?.id) {
          this.historialService.registrarEscaneo({
            herramientaId: data.id,
            accion: 'escaneo',
            referenciaVisual: 'Escaneo automático desde cámara'
          }).subscribe({
            next: () => {
              this.router.navigate(['/detalle-herramienta', data.id]);
            },
            error: (err) => {
              console.warn('⚠️ Error en historial. Redirigiendo igual...', err);
              this.router.navigate(['/detalle-herramienta', data.id]);
            }
          });
        } else {
          this.statusMessage = `❌ No se encontraron detalles para "${nombre}".`;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('❌ Error al buscar herramienta:', err);
        this.statusMessage = '❌ Error de conexión o herramienta no encontrada.';
        this.cdr.detectChanges();
      }
    });
  }
}
