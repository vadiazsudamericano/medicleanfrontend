import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

// La ruta ahora apunta al archivo renombrado 'temperatura.service.ts'
import { TemperaturaService, LecturaTemperatura } from '../temperatura/temperatura.service';

// =========================================================================
// ===             1. IMPORTA 'Location' de Angular                      ===
// =========================================================================
import { Location } from '@angular/common';


@Component({
  selector: 'app-proceso-desinfeccion',
  // Corregimos las rutas para que coincidan con tus nombres de archivo (sin .component)
  templateUrl: './proceso-desinfeccion.html',
  styleUrls: ['./proceso-desinfeccion.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ProcesoDesinfeccionComponent implements OnInit, OnDestroy {

  temperaturaActual: number | null = null;
  mensajeEstado: string = 'Obteniendo datos...';
  estadoClase: string = 'info';
  private intervalId: any;

  // =========================================================================
  // ===             2. INYECTA 'Location' EN EL CONSTRUCTOR               ===
  // =========================================================================
  constructor(
    private temperaturaService: TemperaturaService,
    private location: Location // Añadimos esto
  ) { }

  ngOnInit(): void {
    this.getTemperatura();
    this.intervalId = setInterval(() => {
      this.getTemperatura();
    }, 10000);
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

    if (this.temperaturaActual >= 110 && this.temperaturaActual <= 121) {
      this.mensajeEstado = 'La temperatura de desinfección es la óptima. La herramienta está desinfectada.';
      this.estadoClase = 'exito';
    } else if (this.temperaturaActual < 100) {
      this.mensajeEstado = 'El proceso no es lo suficientemente riguroso para considerarse una esterilización completa.';
      this.estadoClase = 'advertencia';
    } else if (this.temperaturaActual > 134) {
      this.mensajeEstado = '¡Cuidado! Una temperatura alta puede causar deformación o debilitamiento del material.';
      this.estadoClase = 'peligro';
    } else {
      this.mensajeEstado = 'La temperatura está fuera de los rangos críticos, pero no es la óptima.';
      this.estadoClase = 'info';
    }
  }

  // =========================================================================
  // ===             3. AÑADE LA NUEVA FUNCIÓN 'volver()'                  ===
  // =========================================================================
  volver(): void {
    // Esta función de Angular simplemente navega a la página anterior en el historial
    this.location.back();
  }
}