// RUTA: src/app/historial/historial.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para directivas como *ngIf y *ngFor
import { HistorialService, HistorialEntry } from '../servicios/historial.service'; // Importamos el servicio y la interfaz
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-historial',      // El nombre para usarlo en el HTML: <app-historial>
  standalone: true,
  imports: [CommonModule, RouterModule],        // Importamos CommonModule para poder usar *ngIf, *ngFor, etc.
  templateUrl: './historial.html', // Le decimos a Angular dónde está el archivo HTML de este componente
  styleUrls: ['./historial.css']    // Le decimos a Angular dónde está el archivo CSS de este componente
})
export class HistorialComponent implements OnInit {
  
  // Array para almacenar los registros del historial que vienen del backend
  historial: HistorialEntry[] = [];
  
  // Una bandera para saber si estamos esperando la respuesta del servidor
  cargando = true;

  // Inyectamos el HistorialService en el constructor para poder usarlo
  constructor(private historialService: HistorialService) { }

  // ngOnInit es una función que se ejecuta automáticamente cuando el componente se carga
  ngOnInit(): void {
    // Llamamos al método getHistorial() de nuestro servicio
    this.historialService.getHistorial().subscribe({
      
      // La sección 'next' se ejecuta si la petición al backend tiene ÉXITO
      next: (data: HistorialEntry[]) => {
        this.historial = data; // Guardamos los datos recibidos en nuestro array
        this.cargando = false; // Dejamos de mostrar el mensaje de "cargando"
      },
      
      // La sección 'error' se ejecuta si la petición FALLA
      error: (err: any) => {
        console.error('Error al cargar el historial', err); // Mostramos el error en la consola
        this.cargando = false; // Dejamos de cargar, aunque haya habido un error
      }
    });
  }
}