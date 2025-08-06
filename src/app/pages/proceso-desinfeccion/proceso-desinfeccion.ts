import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { TemperaturaService, LecturaTemperatura } from '../temperatura/temperatura.service';
 
@Component({
  selector: 'app-proceso-desinfeccion', 
  templateUrl: './proceso-desinfeccion.html',
  styleUrls: ['./proceso-desinfeccion.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ProcesoDesinfeccionComponent implements OnInit, OnDestroy {

  temperaturaActual: number | null = null;
  mensajeEstado: string = 'Obteniendo datos...';
  estadoClase: string = 'advertencia'; // Inicia en advertencia (amarillo simple)
  private intervalId: any;

  constructor(
    private temperaturaService: TemperaturaService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getTemperatura();
    this.intervalId = setInterval(() => {
      this.getTemperatura();
    }, 2000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getTemperatura(): void {
    this.temperaturaService.getUltimaLectura().subscribe({
      next: (lecturas) => {
        if (lecturas && lecturas.length > 0) {
          this.temperaturaActual = lecturas[0].valor;
          this.actualizarEstado();
        } else {
          this.temperaturaActual = null;
          this.mensajeEstado = 'No se han recibido datos del sensor todavía.';
          this.estadoClase = 'advertencia';
        }
      },
      error: (err) => {
        console.error('Error al obtener la temperatura:', err);
        this.temperaturaActual = null;
        this.mensajeEstado = 'No se pudo conectar con el servidor.';
        this.estadoClase = 'peligro';
      }
    });
  }

  // =========================================================================
  // ===             INICIO: LÓGICA FINAL Y SIMPLIFICADA                   ===
  // =========================================================================
  actualizarEstado(): void {
    if (this.temperaturaActual === null) return;

    // CASO ROJO: ¡PELIGRO!
    if (this.temperaturaActual > 130) {
      this.mensajeEstado = '¡PELIGRO! Temperatura excesiva. RETIRA LA FUENTE DE CALOR INMEDIATAMENTE.';
      this.estadoClase = 'peligro';
    
    // CASO VERDE: ¡ÉXITO Y MANTENER!
    } else if (this.temperaturaActual >= 115) {
      this.mensajeEstado = '¡ÉXITO! Temperatura óptima alcanzada. Retira la fuente de calor. La herramienta está desinfectada.';
      this.estadoClase = 'exito';
    
    // CASO AMARILLO: ¡PRECALENTAMIENTO!
    } else if (this.temperaturaActual >= 80) {
      this.mensajeEstado = 'Aleja la pistola de calor y espera. Si la temperatura no sube a 115°C, aplica más calor en ráfagas cortas.';
      this.estadoClase = 'precalentamiento';
    
    // CASO INICIAL: DEMASIADO FRÍO (Amarillo simple)
    } else {
      this.mensajeEstado = 'El proceso no es lo suficientemente riguroso. Aplica calor de forma constante hasta alcanzar al menos 80°C.';
      this.estadoClase = 'advertencia';
    }
  }
  // =========================================================================
  // ===              FIN: LÓGICA FINAL Y SIMPLIFICADA                     ===
  // =========================================================================
  
  volver(): void { 
    this.location.back();
  }
}