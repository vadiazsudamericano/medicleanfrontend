// RUTA: src/app/historial/historial.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegistroService, Registro } from '../servicios/registro.service';
import {delay} from 'rxjs/operators';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './historial.html',
  styleUrls: ['./historial.css']
})
export class HistorialComponent implements OnInit {
  todosLosRegistros: Registro[] = [];
  registrosFiltrados: Registro[] = [];
  cargando = true;
  terminoBusqueda = '';

  constructor(private registroService: RegistroService) {}

  ngOnInit(): void {
    this.registroService.getRegistros().subscribe({
      next: (data) => {
        this.todosLosRegistros = data;
        this.registrosFiltrados = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar el historial:', err);
        this.cargando = false;
      }
    });
  }

  filtrarRegistros(): void {
    const busqueda = this.terminoBusqueda.toLowerCase().trim();
    if (!busqueda) {
      this.registrosFiltrados = this.todosLosRegistros;
      return;
    }
    this.registrosFiltrados = this.todosLosRegistros.filter(registro =>
      registro.evento.toLowerCase().includes(busqueda) ||
      registro.responsable.toLowerCase().includes(busqueda)
    );
  }
}