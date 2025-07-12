// RUTA: src/app/registrar-herramienta/registrar-herramienta.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HerramientaService } from '../servicios/herramienta.service'; // Importamos el servicio

@Component({
  selector: 'app-registrar-herramienta',
  standalone: true,
  imports: [CommonModule, FormsModule], // ¡FormsModule es clave!
  templateUrl: './registrar-herramienta.html',
  styleUrls: ['./registrar-herramienta.css']
})
export class RegistrarHerramientaComponent {

  // Objeto para almacenar los datos de la nueva herramienta
  nuevaHerramienta = {
    nombre: '',
    descripcion: '',
    estado: 'Esterilizado' // Valor por defecto
  };

  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private herramientaService: HerramientaService,
    private router: Router
  ) {}

  onRegistrarHerramienta(): void {
    this.errorMessage = null;
    this.successMessage = null;

    console.log('Registrando nueva herramienta:', this.nuevaHerramienta);

    // Llamamos a la función 'crearHerramienta' de nuestro servicio
    this.herramientaService.crearHerramienta(this.nuevaHerramienta).subscribe({
      next: (response: any) => {
        console.log('Herramienta creada con éxito:', response);
        this.successMessage = '¡Herramienta registrada correctamente!';
        
        // Opcional: redirigir a la lista de herramientas después de un momento
        setTimeout(() => {
          this.router.navigate(['/herramientas']); // Asumiendo que tienes una ruta /herramientas
        }, 2000);
      },
      error: (err: any) => {
        console.error('Error al crear la herramienta:', err);
        this.errorMessage = err.error?.message || 'Ocurrió un error al registrar la herramienta.';
      }
    });
  }
}