// RUTA: src/app/detalle-herramienta/detalle-herramienta.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router'; // <-- Importa ActivatedRoute y RouterLink
import { HerramientaService, HerramientaBackend } from '../servicios/herramienta.service';

@Component({
  selector: 'app-detalle-herramienta',
  standalone: true,
  imports: [CommonModule, RouterLink], // <-- Añade RouterLink para el botón de volver
  templateUrl: './detalle-herramienta.html',
  styleUrls: ['./detalle-herramienta.css']
})
export class DetalleHerramientaComponent implements OnInit {

  // Propiedad para guardar la herramienta una vez que la encontremos
  herramienta: HerramientaBackend | null = null;
  
  // Mensaje que se muestra mientras se cargan los datos
  mensajeCarga: string = 'Cargando datos de la herramienta...';

  constructor(
    private route: ActivatedRoute, // Inyectamos ActivatedRoute para leer la URL
    private herramientaService: HerramientaService // Inyectamos el servicio para buscar datos
  ) {}

  ngOnInit(): void {
    // 1. Obtenemos el parámetro 'nombre' de la URL.
    const nombreHerramienta = this.route.snapshot.paramMap.get('nombre');

    // 2. Verificamos si el nombre existe en la URL
    if (nombreHerramienta) {
      // 3. Si existe, usamos el servicio para buscar la herramienta en el backend.
      this.herramientaService.getHerramientaPorNombre(nombreHerramienta).subscribe({
        // Esto se ejecuta si la petición tiene ÉXITO
        next: (data) => {
          console.log('Datos recibidos del backend:', data);
          this.herramienta = data; // Guardamos los datos recibidos
        },
        // Esto se ejecuta si la petición FALLA (ej: error 404 si se modifica la URL a mano)
        error: (err) => {
          console.error('Error al cargar la herramienta:', err);
          this.mensajeCarga = `No se pudieron encontrar los datos para "${nombreHerramienta}".`;
        }
      });
    } else {
      // Si por alguna razón no hay nombre en la URL
      this.mensajeCarga = 'No se ha especificado ninguna herramienta.';
    }
  }
}