import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ IMPORTANTE

@Component({
  selector: 'app-registrar-herramienta',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ AGREGA FormsModule
  templateUrl: './registrar-herramienta.html',
  styleUrls: ['./registrar-herramienta.css']
})
export class RegistrarHerramientaComponent {
  nuevaHerramienta = {
    id: 0,
    nombre: '',
    descripcion: '',
    uso: '',
    proceso: ['Paso 1', 'Paso 2'], // TS lo infiere como string[]
    estado: '',
    esterilizacion: '',
    procesoTexto: '' // para texto separado por coma
  };

  registrar(): void {
    this.nuevaHerramienta.proceso = this.nuevaHerramienta.procesoTexto
      .split(',')
      .map((p: string) => p.trim());

    console.log('Datos a guardar:', this.nuevaHerramienta);
    // Aquí iría la llamada al servicio
  }
}
