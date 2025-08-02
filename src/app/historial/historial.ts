import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HistorialService } from '../servicios/historial.service';

@Component({
  selector: 'app-historial',
  standalone: true,
  templateUrl: './historial.html',
  styleUrls: ['./historial.css'],
  imports: [CommonModule, RouterModule]
})
export class HistorialComponent implements OnInit {
  historial: any[] = [];

  constructor(
    private historialService: HistorialService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.historialService.getHistorial().subscribe({
      next: (res) => {
        this.historial = res;
      },
      error: (err) => {
        console.error('❌ Error al cargar historial:', err);
      }
    });
  }

  verDetalle(id: number | undefined) {
  console.log('ID de herramienta seleccionado:', id);
  if (id !== undefined && id !== null) {
    this.router.navigate(['/detalle-herramienta', id]);
  }
}

}
