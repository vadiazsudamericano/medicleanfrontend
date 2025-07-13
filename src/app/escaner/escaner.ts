// RUTA: src/app/escaner/escaner.ts

import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgZone, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as tmImage from '@teachablemachine/image';
import { HerramientaService, HerramientaBackend } from '../servicios/herramienta.service';

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
export class EscanerComponent implements OnInit, OnDestroy, AfterViewInit {
  // --- ¡TUS URLS DE TEACHABLE MACHINE AQUÍ! ---
  readonly MODEL_URL = 'https://teachablemachine.withgoogle.com/models/5L8ADLfMp/model.json';
  readonly METADATA_URL = 'https://teachablemachine.withgoogle.com/models/5L8ADLfMp/metadata.json';


  @ViewChild('webcamContainer', { static: false }) webcamContainer!: ElementRef;
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef;

  model: any;
  webcam: any;
  predictions: Prediction[] = [];
  statusMessage = 'Cargando modelo...';
  herramientaDetectada: Prediction | null = null;
  detallesHerramienta: HerramientaBackend | null = null;
  
  // Nueva propiedad para manejar la clase CSS de forma segura
  claseEstado: string = '';

  private animationFrameId: number | null = null;
  private ultimoNombreDetectado: string | null = null;

  constructor(
    private zone: NgZone,
    private router: Router,
    private herramientaService: HerramientaService
  ) {}

  async ngOnInit() {
    try {
      this.model = await tmImage.load(this.MODEL_URL, this.METADATA_URL);
      this.statusMessage = 'Modelo cargado. Iniciando cámara...';
      this.webcam = new tmImage.Webcam(400, 400, true);
      await this.webcam.setup();
    } catch (e) {
      console.error('Error en ngOnInit:', e);
      this.statusMessage = 'Error al cargar el modelo o iniciar la cámara.';
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.webcam) {
        const video = this.videoElement.nativeElement as HTMLVideoElement;
        video.srcObject = this.webcam.webcam.srcObject;
        this.webcamContainer.nativeElement.appendChild(this.webcam.canvas);
        this.webcam.play();
        this.statusMessage = '¡Listo! Apunta a la herramienta.';
        this.loop();
      } else {
        this.statusMessage = 'La cámara no se pudo iniciar. Refresca la página.';
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
      
      let deteccionActual: Prediction | null = null;
      for (const p of prediction) {
        if (p.probability > 0.95 && p.className.toLowerCase() !== 'fondo' && p.className.toLowerCase() !== 'desconocido') {
          deteccionActual = p;
          break;
        }
      }
      
      if (deteccionActual && deteccionActual.className !== this.ultimoNombreDetectado) {
        this.ultimoNombreDetectado = deteccionActual.className;
        this.buscarDetallesHerramienta(deteccionActual.className);
      } else if (!deteccionActual) {
        this.ultimoNombreDetectado = null;
        this.detallesHerramienta = null;
        this.claseEstado = ''; // Limpiamos la clase cuando no se detecta nada
      }

      this.zone.run(() => {
        this.predictions = prediction as Prediction[];
        this.herramientaDetectada = deteccionActual;
      });

      this.animationFrameId = window.requestAnimationFrame(() => this.loop());
    }
  }

  buscarDetallesHerramienta(nombre: string): void {
    this.herramientaService.getHerramientaPorNombre(nombre).subscribe(data => {
      if (data) {
        this.detallesHerramienta = data;
        // Calculamos la clase CSS aquí, de forma segura
        this.claseEstado = this.detallesHerramienta.estado?.toLowerCase().split(' ')[0] || '';
      } else {
        this.detallesHerramienta = { nombre: nombre, id: 0, estado: 'No registrado' };
        // Asignamos una clase para el caso 'No registrado'
        this.claseEstado = 'no-registrado';
      }
    });
  }

  onConfirmarHerramienta(nombreHerramienta: string) {
    this.router.navigate(['/detalle-herramienta', nombreHerramienta]);
  }
}