// RUTA: src/app/historial/historial.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorialService, HistorialEntry } from '../servicios/historial.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './historial.html',
  styleUrls: ['./historial.css']
})
export class HistorialComponent implements OnInit {
  
  historial: HistorialEntry[] = [];
  cargando = true;

  constructor(private historialService: HistorialService) { }

  ngOnInit(): void {
    this.historialService.getHistorial().subscribe({
      next: (data: HistorialEntry[]) => {
        // Ordenamos por fecha para mostrar lo más reciente primero
        this.historial = data.sort((a, b) => new Date(b.fechaEscaneo).getTime() - new Date(a.fechaEscaneo).getTime());
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al cargar el historial', err);
        this.cargando = false;
      }
    });
  }

  // --- ¡MEJORA AÑADIDA! ---
  /**
   * Genera una clase CSS a partir del string de estado para colorear los tags.
   * @param estado El string del estado (ej. "Requiere esterilizacion").
   * @returns Una clase CSS formateada (ej. "tag-requiere").
   */
  getEventClass(estado?: string): string {
    if (!estado) {
      return 'tag-no-registrado';
    }
    // Tomamos solo la primera palabra para simplificar (ej. "en" de "en mantenimiento")
    const primeraPalabra = estado.toLowerCase().split(' ')[0];
    return `tag-${primeraPalabra}`;
  }
}