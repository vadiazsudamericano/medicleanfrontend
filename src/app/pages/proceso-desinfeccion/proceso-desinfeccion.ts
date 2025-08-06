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

  // =========================================================================
  // ===             INICIO: SECCIÓN CORREGIDA CON NUEVA LÓGICA            ===
  // =========================================================================
  actualizarEstado(): void {
    if (this.temperaturaActual === null) return;

    // Caso 1: ¡PELIGRO! Temperatura muy alta.
    if (this.temperaturaActual > 130) {
      this.mensajeEstado = '¡PELIGRO! Temperatura excesiva. RETIRA LA FUENTE DE CALOR INMEDIATAMENTE para evitar daños en la herramienta.';
      this.estadoClase = 'peligro';
    
    // Caso 2: ¡ÉXITO! Rango de esterilización alcanzado.
    } else if (this.temperaturaActual >= 115 && this.temperaturaActual <= 121) {
      this.mensajeEstado = '¡ÉXITO! Temperatura óptima alcanzada. Retira la fuente de calor. La herramienta está desinfectada.';
      this.estadoClase = 'exito';
    
    // Caso 3: ¡ATENCIÓN! Zona de pre-calentamiento.
    } else if (this.temperaturaActual >= 80 && this.temperaturaActual < 115) {
      this.mensajeEstado = 'Aleja la pistola de calor y espera. Si la temperatura no sube a 115°C, aplica más calor en ráfagas cortas.';
      this.estadoClase = 'precalentamiento';
    
    // Caso 4: ADVERTENCIA. Temperatura demasiado baja.
    } else if (this.temperaturaActual < 80) {
      this.mensajeEstado = 'El proceso no es lo suficientemente riguroso. Aplica calor de forma constante hasta alcanzar al menos 80°C.';
      this.estadoClase = 'advertencia';
    
    // Caso 5: Temperatura por encima del rango óptimo, pero aún no peligrosa.
    } else { // Esto cubre el rango > 121 y <= 130
      this.mensajeEstado = 'Temperatura por encima de la óptima. Retira la fuente de calor y deja que la herramienta se enfríe.';
      this.estadoClase = 'info';
    }
  }
  // =========================================================================
  // ===              FIN: SECCIÓN CORREGIDA CON NUEVA LÓGICA              ===
  // =========================================================================
  
  volver(): void { 
    this.location.back();
  }
}