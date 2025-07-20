// RUTA: src/app/escaner/escaner.component.ts

import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  NgZone,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as tmImage from '@teachablemachine/image';
import { HerramientaService } from '../servicios/herramienta.service';

interface Prediction {
  className: string;
  probability: number;
}

@Component({
  selector: 'app-escaner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './escaner.html',
  styleUrls: ['./escaner.css']
})
export class EscanerComponent implements OnInit, OnDestroy {
  // URLs del modelo
  readonly MODEL_URL = 'https://teachablemachine.withgoogle.com/models/5L8ADLfMp/model.json';
  readonly METADATA_URL = 'https://teachablemachine.withgoogle.com/models/5L8ADLfMp/metadata.json';

  @ViewChild('webcamContainer', { static: true }) webcamContainer!: ElementRef;

  // Propiedades necesarias
  model: any;
  webcam: any;
  predictions: Prediction[] = [];
  statusMessage = 'Cargando modelo...';
  herramientaDetectada: Prediction | null = null;
  private animationFrameId: number | null = null;

  constructor(
    private zone: NgZone,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    try {
      this.model = await tmImage.load(this.MODEL_URL, this.METADATA_URL);
      this.statusMessage = 'Modelo cargado. Iniciando cámara...';
      this.cdr.detectChanges();

      this.webcam = new tmImage.Webcam(400, 400, true);
      await this.webcam.setup();
      
      this.webcamContainer.nativeElement.appendChild(this.webcam.canvas);
      await this.webcam.play();
      this.statusMessage = '¡Listo! Apunta a la herramienta.';
      this.cdr.detectChanges();

      this.loop();
    } catch (e) {
      console.error('Error al iniciar la webcam o cargar el modelo:', e);
      this.statusMessage = 'No se pudo iniciar la cámara. Asegúrate de dar permisos y refresca la página.';
      this.cdr.detectChanges();
    }
  }

  async ngOnDestroy() {
    if (this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId);
    }
    if (this.webcam && this.webcam.playing) {
      await this.webcam.stop();
    }
  }

  async loop() {
    if (this.webcam) {
      this.webcam.update();
      const prediction = await this.model.predict(this.webcam.canvas);
      let deteccionActual: Prediction | null = null;
      for (const p of prediction) {
        if (p.probability > 0.95 && p.className.toLowerCase() !== 'fondo' && p.className.toLowerCase() !== 'desconocido') {
          deteccionActual = p;
          break;
        }
      }
      
      this.zone.run(() => {
        this.predictions = prediction as Prediction[];
        this.herramientaDetectada = deteccionActual;
      });

      this.animationFrameId = window.requestAnimationFrame(() => this.loop());
    }
  }

  // Esta es la única función que el botón "Confirmar" necesita.
  // Su única responsabilidad es llevar al usuario a la página de detalles.
  onConfirmarHerramienta(nombreHerramienta: string) {
    this.router.navigate(['/detalle-herramienta', nombreHerramienta]);
  }
}