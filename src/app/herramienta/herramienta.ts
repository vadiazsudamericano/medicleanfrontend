import { Component } from '@angular/core';
import { HerramientaService, HerramientaBackend } from '../servicios/herramienta.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-herramienta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Registrar nueva herramienta</h2>
    <form (ngSubmit)="guardar()">
      <input [(ngModel)]="nombre" name="nombre" placeholder="Nombre" required>
      <input [(ngModel)]="tipo" name="tipo" placeholder="Tipo/Descripción" required>
      <input [(ngModel)]="codigo" name="codigo" placeholder="Código/Uso" required>
      <button type="submit">Guardar</button>
    </form>
  `,
})
export class HerramientaComponent {
  nombre = '';
  tipo = '';
  codigo = '';

  constructor(private servicio: HerramientaService) {}

  guardar() {
    const data: HerramientaBackend = {
      id: 0,
      nombre: this.nombre,
      descripcion: this.tipo,
      uso: this.codigo,
      proceso: [],
      estado: 'Nuevo',
      esterilizacion: 'Autoclave'
    };

    this.servicio.crearHerramienta(data).subscribe(() => {
      console.log('✅ Herramienta creada');
      // Puedes limpiar los campos o redirigir aquí
      this.nombre = '';
      this.tipo = '';
      this.codigo = '';
    });
  }
}
