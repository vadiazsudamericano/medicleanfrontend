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
  estadoClase: string = 'info'; // Puede ser: exito, precalentamiento, peligro, advertencia
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
          this.estadoClase = 'advertencia'; // Cambiado a 'advertencia' para que no sea azul
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
  // ===             INICIO: LÓGICA FINAL Y CORREGIDA                    ===
  // =========================================================================
  actualizarEstado(): void {
    if (this.temperaturaActual === null) return;

    // Caso 1: ¡PELIGRO! Temperatura muy alta.
    if (this.temperaturaActual > 130) {
      this.mensajeEstado = '¡PELIGRO! Temperatura excesiva. RETIRA LA FUENTE DE CALOR INMEDIATAMENTE para evitar daños en la herramienta.';
      this.estadoClase = 'peligro';
    
    // CASO 2: ZONA DE ÉXITO EXTENDIDA. ¡SIEMPRE VERDE!
    } else if (this.temperaturaActual >= 115) { // Cubre de 115°C a 130°C
      this.estadoClase = 'exito'; // La alerta siempre será VERDE en este rango.
      
      // Mensaje específico si está en el rango ideal
      if (this.temperaturaActual <= 121) {
        this.mensajeEstado = '¡ÉXITO! Temperatura óptima alcanzada. Retira la fuente de calor. La herramienta está desinfectada.';
      } else { // Mensaje si está por encima del ideal pero no es peligroso
        this.mensajeEstado = 'Temperatura por encima de la óptima. Mantén retirada la fuente de calor y deja que la herramienta se enfríe.';
      }
    
    // CASO 3: ZONA DE PRE-CALENTAMIENTO (Amarilla)
    } else if (this.temperaturaActual >= 80) {
      this.mensajeEstado = 'Aleja la pistola de calor y espera. Si la temperatura no sube a 115°C, aplica más calor en ráfagas cortas.';
      this.estadoClase = 'precalentamiento';
    
    // CASO 4: ZONA DEMASIADO FRÍA (Azul simple por defecto)
    } else {
      this.mensajeEstado = 'El proceso no es lo suficientemente riguroso. Aplica calor de forma constante hasta alcanzar al menos 80°C.';
      this.estadoClase = 'advertencia';
    } 
  }
  // =========================================================================
  // ===              FIN: LÓGICA FINAL Y CORREGIDA                      ===
  // =========================================================================
  
  volver(): void { 
    this.location.back();
  }
}