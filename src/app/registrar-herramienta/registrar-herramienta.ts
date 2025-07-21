// RUTA: src/app/registrar-herramienta/registrar-herramienta.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // FormsModule es clave para los formularios
import { HerramientaService, HerramientaBackend } from '../servicios/herramienta.service';

@Component({
  selector: 'app-registrar-herramienta',
  standalone: true,
  imports: [CommonModule, FormsModule], // ¡Importamos FormsModule!
  templateUrl: './registrar-herramienta.html',
  styleUrls: ['./registrar-herramienta.css']
})
export class RegistrarHerramientaComponent {

  // Objeto para almacenar los datos del formulario
  nuevaHerramienta = {
    nombre: '',
    descripcion: '',
    uso: '',
    esterilizacion: '',
    estado: 'Esterilizado', // Valor por defecto
    proceso: '' // Guardamos el proceso como un solo string
  };

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private herramientaService: HerramientaService) { }

  onSubmit(): void {
    // Convertimos el string de 'proceso' en un array de strings
    const procesoArray = this.nuevaHerramienta.proceso.split(',').map(item => item.trim());

    // Creamos el objeto final para enviar al backend
    const payload: HerramientaBackend = {
      ...this.nuevaHerramienta,
      proceso: procesoArray,
      id: 0 // El backend asignará el ID
    };

    this.herramientaService.crearHerramienta(payload).subscribe({
      next: (response) => {
        this.successMessage = `¡Herramienta "${response.nombre}" registrada con éxito!`;
        this.errorMessage = null;
        this.resetForm();
      },
      error: (err) => {
        console.error('Error al registrar la herramienta', err);
        this.errorMessage = 'No se pudo registrar la herramienta. Inténtalo de nuevo.';
        this.successMessage = null;
      }
    });
  }

  resetForm(): void {
    this.nuevaHerramienta = {
      nombre: '',
      descripcion: '',
      uso: '',
      esterilizacion: '',
      estado: 'Esterilizado',
      proceso: ''
    };
  }
}