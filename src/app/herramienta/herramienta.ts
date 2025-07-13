import { Component } from '@angular/core';
import { HerramientaService } from '../servicios/herramienta.service';
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
      <input [(ngModel)]="tipo" name="tipo" placeholder="Tipo" required>
      <input [(ngModel)]="codigo" name="codigo" placeholder="Código" required>
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
    const data = { nombre: this.nombre, tipo: this.tipo, codigo: this.codigo };
    this.servicio.crearHerramienta(data).subscribe(() => {
      alert('Herramienta guardada');
    });
  }
}
