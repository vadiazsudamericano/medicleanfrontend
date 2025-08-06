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
  // Añadimos 'precalentamiento' a los posibles estados
  estadoClase: string = 'info'; // Puede ser: info, exito, advertencia, peligro, precalentamiento
  private intervalId: any;

  constructor(
    private temperaturaService: TemperaturaService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getTemperatura();
    // Lo ponemos en 2 segundos para la reactividad
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
          this.estadoClase = 'info';
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

  actualizarEstado(): void {
    if (this.temperaturaActual === null) return;

    // Caso 1: ¡PELIGRO! Demasiado caliente.
    if (this.temperaturaActual > 134) {
      this.mensajeEstado = '¡CUIDADO! Una temperatura alta puede causar deformación o debilitamiento del material.';
      this.estadoClase = 'peligro';
    
    // Caso 2: ¡ÉXITO! Rango óptimo.
    } else if (this.temperaturaActual >= 110 && this.temperaturaActual <= 121) {
      this.mensajeEstado = 'La temperatura de desinfección es la ÓPTIMA. La herramienta está desinfectada.';
      this.estadoClase = 'exito';
    
    // Caso 3: ¡NUEVO ESTADO! Pre-calentamiento.
    } else if (this.temperaturaActual >= 80 && this.temperaturaActual < 110) {
      this.mensajeEstado = 'Aleja la pistola de calor y espera. Si la temperatura no sube a 110°C, aplica más calor en ráfagas cortas.';
      this.estadoClase = 'precalentamiento'; // Estado especial para una alerta informativa
    
    // Caso 4: ¡ADVERTENCIA! Demasiado frío.
    } else if (this.temperaturaActual < 80) {
      this.mensajeEstado = 'El proceso no es lo suficientemente riguroso. Aplica calor de forma constante hasta alcanzar al menos 80°C.';
      this.estadoClase = 'advertencia';
    
    // Caso 5: Entre el óptimo y el peligroso.
    } else {
      this.mensajeEstado = 'Temperatura por encima de la óptima. Retira la fuente de calor y deja que se enfríe hasta el rango ideal.';
      this.estadoClase = 'info';
    }
  }
  
  volver(): void { 
    this.location.back();
  }
}