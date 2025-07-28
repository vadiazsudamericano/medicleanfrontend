// RUTA: src/app/historial/historial.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorialService, HistorialEntry } from '../servicios/historial.service'; // Asegúrate de que la ruta es correcta
import { AuthService } from '../auth/auth.service'; // Si usas un servicio de autenticación

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.html',
  styleUrls: ['./historial.css']
})
export class HistorialComponent implements OnInit {
  historial: HistorialEntry[] = [];
  isLoading = true;
  errorMessage: string = '';

  constructor(
    private historialService: HistorialService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'Debes iniciar sesión para ver el historial.';
      this.isLoading = false;
      return;
    }

    this.historialService.getHistorial().subscribe({
      next: (data: HistorialEntry[]) => {
        this.historial = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar el historial:', err);
        this.errorMessage = 'Token inválido o expirado. Por favor, inicia sesión nuevamente.';
        this.isLoading = false;
      }
    });
  }
}
