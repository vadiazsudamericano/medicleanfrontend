// RUTA: src/app/escaner/escaner.component.ts

import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as tmImage from '@teachablemachine/image';
import { HerramientaService } from '../servicios/herramienta.service';
import { HistorialService } from '../servicios/historial.service';

// --- Interfaces para un tipado más fuerte ---
interface Prediction {
  className: string;
  probability: number;
}
interface TeachableMachineModel {
  predict(canvas: HTMLCanvasElement): Promise<Prediction[]>;
}

// --- ¡CORRECCIÓN! ---
// La interfaz ahora refleja EXACTAMENTE lo que la librería nos da.
interface Webcam {
  setup: () => Promise<void>;
  play: () => Promise<void>;
  stop: () => void;
  update: () => void;
  canvas: HTMLCanvasElement;
  // playing: boolean; <-- SE ELIMINA ESTA LÍNEA
}

@Component({
  selector: 'app-escaner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './escaner.html',
  styleUrls: ['./escaner.css']
})
export class EscanerComponent implements OnInit, OnDestroy {
  // --- Constantes para una configuración más sencilla ---
  private readonly MODEL_URL = 'https://teachablemachine.withgoogle.com/models/5L8ADLfMp/model.json';
  private readonly METADATA_URL = 'https://teachablemachine.withgoogle.com/models/5L8ADLfMp/metadata.json';
  private readonly PREDICTION_THRESHOLD = 0.95;
  private readonly IGNORED_CLASSES = ['fondo', 'desconocido'];

  @ViewChild('webcamContainer', { static: true }) webcamContainer!: ElementRef;
  
  private model!: TeachableMachineModel;
  private webcam!: Webcam;
  private animationFrameId: number | null = null;
  
  public statusMessage = 'Cargando modelo...';
  public herramientaDetectada: Prediction | null = null;

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
      await this.webcam.setup();
      await this.webcam.play();
      this.webcamContainer.nativeElement.appendChild(this.webcam.canvas);
      
      this.statusMessage = '¡Listo! Apunta a la herramienta.';
      this.cdr.detectChanges();
      
      this.loop();
    } catch (e) {
      console.error('Error al iniciar la webcam o cargar el modelo:', e);
      this.statusMessage = 'No se pudo iniciar la cámara. Asegúrate de dar permisos y refresca la página.';
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId);
    }
    // --- ¡MEJORA! ---
    // Comprobamos si la webcam existe antes de intentar detenerla. Es más seguro.
    if (this.webcam) {
      this.webcam.stop();
    }
  }

  private async loop() {
    if (this.webcam) {
      this.webcam.update();
      const predictions = await this.model.predict(this.webcam.canvas);
      let deteccionActual: Prediction | null = null;

      for (const p of predictions) {
        if (
          p.probability > this.PREDICTION_THRESHOLD &&
          !this.IGNORED_CLASSES.includes(p.className.toLowerCase())
        ) {
          deteccionActual = p;
          break;
        }
      }
      
      this.zone.run(() => {
        this.herramientaDetectada = deteccionActual;
      });

      this.animationFrameId = window.requestAnimationFrame(() => this.loop());
    }
  }

  public onConfirmarHerramienta(nombreHerramienta: string) {
    this.herramientaService.getHerramientaPorNombre(nombreHerramienta).subscribe({
      next: (data) => {
        if (data && data.id && data.estado) {
          this.historialService.registrarEscaneo({
            herramientaId: data.id,
            estadoAlEscanear: data.estado
          }).subscribe({
            next: () => {
              console.log('Escaneo registrado. Navegando a detalles...');
              this.router.navigate(['/detalle-herramienta', nombreHerramienta]);
            },
            error: (err) => {
              console.error('Error al registrar, pero navegando de todas formas:', err);
              this.router.navigate(['/detalle-herramienta', nombreHerramienta]);
            }
          });
        } else {
          this.statusMessage = `Error: No se encontraron detalles para "${nombreHerramienta}" en la base de datos.`;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error al buscar la herramienta en la base de datos:', err);
        this.statusMessage = 'Error de conexión con la base de datos.';
        this.cdr.detectChanges();
      }
    });
  }
}