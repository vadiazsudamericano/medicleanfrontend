import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import * as tmImage from '@teachablemachine/image';
import { HerramientaService } from '../servicios/herramienta.service';
import { HistorialService } from '../servicios/historial.service';

interface Prediction {
  className: string;
  probability: number;
}
interface TeachableMachineModel {
  predict(canvas: HTMLCanvasElement): Promise<Prediction[]>;
}
interface Webcam {
  setup: () => Promise<void>;
  play: () => Promise<void>;
  stop: () => void;
  update: () => void;
  canvas: HTMLCanvasElement;
}

@Component({
  selector: 'app-escaner',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './escaner.html',
  styleUrls: ['./escaner.css']
})
export class EscanerComponent implements OnInit, OnDestroy {
  private readonly MODEL_URL = 'https://teachablemachine.withgoogle.com/models/5L8ADLfMp/model.json';
  private readonly METADATA_URL = 'https://teachablemachine.withgoogle.com/models/5L8ADLfMp/metadata.json';
  private readonly PREDICTION_THRESHOLD = 0.95;
  private readonly IGNORED_CLASSES = ['background', 'desconocido'];

  @ViewChild('webcamContainer', { static: true }) webcamContainer!: ElementRef;

  private model!: TeachableMachineModel;
  private webcam!: Webcam;
  private animationFrameId: number | null = null;
  private predictionIntervalId: any | null = null;

  public statusMessage: string | null = 'Cargando modelo...';
  public herramientaDetectada: Prediction | null = null;

  constructor(
    private zone: NgZone,
    private router: Router,
    private herramientaService: HerramientaService,
    private historialService: HistorialService,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    try {
      this.model = await tmImage.load(this.MODEL_URL, this.METADATA_URL);
      this.statusMessage = 'Modelo cargado. Iniciando cámara...';
      this.cdr.detectChanges();

      this.webcam = new tmImage.Webcam(400, 400, true);
      await this.webcam.setup();
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
      window.cancelAnimationFrame(this.animationFrameId);
    }
    if (this.predictionIntervalId) {
      clearInterval(this.predictionIntervalId);
    }
    if (this.webcam) {
      this.webcam.stop();
    }
  }

  private startRenderLoop() {
    const loop = () => {
      if (this.webcam) {
        this.webcam.update();
      }
      this.animationFrameId = window.requestAnimationFrame(loop);
    };
    this.animationFrameId = window.requestAnimationFrame(loop);
  }

  private startPredictionLoop() {
    if (this.statusMessage) {
      this.zone.run(() => { this.statusMessage = null; });
    }

    this.predictionIntervalId = setInterval(async () => {
      await this.predict();
    }, 300);
  }

  private async predict() {
    if (!this.webcam || !this.webcam.canvas) return;

    const predictions = await this.model.predict(this.webcam.canvas);

    const bestPrediction = predictions.reduce(
      (max, pred) => (pred.probability > max.probability ? pred : max),
      predictions[0]
    );

    let deteccionFinal: Prediction | null = null;

    if (
      bestPrediction &&
      bestPrediction.probability > this.PREDICTION_THRESHOLD &&
      !this.IGNORED_CLASSES.includes(bestPrediction.className.toLowerCase())
    ) {
      deteccionFinal = bestPrediction;
    }

    this.zone.run(() => {
      if (this.herramientaDetectada?.className !== deteccionFinal?.className) {
        this.herramientaDetectada = deteccionFinal;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Se ejecuta cuando el usuario confirma la herramienta detectada.
   */
  public onConfirmarHerramienta(nombreHerramienta: string) {
    this.herramientaService.getHerramientaPorNombre(nombreHerramienta.trim()).subscribe({
      next: (data) => {
        if (data && data.id && data.estado) {
          this.historialService.registrarEscaneo({
            herramientaId: data.id,
            estadoAlEscanear: data.estado
          }).subscribe({
            next: () => {
              console.log('✅ Escaneo registrado. Navegando a detalles...');
              this.router.navigate(['/detalle-herramienta', nombreHerramienta]);
            },
            error: (err: any) => {
              console.error('⚠️ Error al registrar escaneo, pero navegando igual:', err);
              this.router.navigate(['/detalle-herramienta', nombreHerramienta]);
            }
          });
        } else {
          this.statusMessage = `❌ No se encontraron detalles para "${nombreHerramienta}".`;
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        console.error('❌ Error al buscar la herramienta en la base de datos:', err);
        this.statusMessage = '❌ Error de conexión o herramienta no encontrada.';
        this.cdr.detectChanges();
      }
    });
  }
}
