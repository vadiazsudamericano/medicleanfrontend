// RUTA: src/app/escaner/escaner.ts

import { Component, OnDestroy, ViewChild, ElementRef, NgZone, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as tmImage from '@teachablemachine/image';

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
export class EscanerComponent implements OnDestroy, AfterViewInit {
  // --- ¡TUS URLS REALES VAN AQUÍ! ---
  readonly MODEL_URL = 'https://teachablemachine.withgoogle.com/models/5L8ADLfMp/model.json';
  readonly METADATA_URL = 'https://teachablemachine.withgoogle.com/models/5L8ADLfMp/metadata.json';

  @ViewChild('webcamContainer', { static: false }) webcamContainer!: ElementRef;
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef;

  model: any;
  webcam: any;
  predictions: Prediction[] = [];
  statusMessage = 'Cargando...';
  herramientaDetectada: Prediction | null = null;
  private animationFrameId: number | null = null;

  constructor(private zone: NgZone, private router: Router) {}

  // Quitamos ngOnInit, toda la lógica de inicio va a ngAfterViewInit
  
  async ngAfterViewInit() {
    // Usamos setTimeout para evitar errores de ciclo de vida
    setTimeout(async () => {
      try {
        this.statusMessage = 'Cargando modelo...';
        this.model = await tmImage.load(this.MODEL_URL, this.METADATA_URL);
        
        this.statusMessage = 'Modelo cargado. Iniciando cámara...';
        this.webcam = new tmImage.Webcam(400, 400, true);
        await this.webcam.setup(); // Pide permiso
        await this.webcam.play(); // Empieza a capturar en segundo plano
        
        // Ahora que la vista está lista, conectamos todo al DOM
        const video = this.videoElement.nativeElement as HTMLVideoElement;
        video.srcObject = this.webcam.webcam.srcObject;
        
        this.webcamContainer.nativeElement.appendChild(this.webcam.canvas);
        
        this.statusMessage = '¡Listo! Apunta a la herramienta.';
        this.loop();

      } catch (e) {
        console.error('ERROR FATAL en la inicialización:', e);
        this.statusMessage = 'Hubo un error crítico al iniciar la cámara. Revisa la consola.';
      }
    }, 0);
  }

  async ngOnDestroy() {
    if (this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId);
    }
    if (this.webcam) {
      await this.webcam.stop();
    }
  }

  async loop() {
    if (this.webcam) {
      this.webcam.update();
      const prediction = await this.model.predict(this.webcam.canvas);
      
      let deteccionActual = null;
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

  onConfirmarHerramienta(nombreHerramienta: string) {
    this.router.navigate(['/detalle-herramienta', nombreHerramienta]);
  }
}