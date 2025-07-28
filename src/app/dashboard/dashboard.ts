// RUTA: src/app/dashboard/dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HerramientaService } from '../servicios/herramienta.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  nombreUsuario: string = 'Usuario';
  totalHerramientas: number = 0;
  requierenAtencion: number = 0;
  cargando = true;
  isAdmin = false; // La única variable que necesitamos para el rol

  constructor(
    private authService: AuthService,
    private herramientaService: HerramientaService
  ) {}

  ngOnInit(): void {
    // 1. Obtenemos el rol del usuario de forma segura desde el servicio.
    this.isAdmin = this.authService.getUserRole() === 'admin';
    
    // 2. Obtenemos el nombre de usuario
    this.obtenerNombreUsuario();

    // 3. Cargamos los datos del dashboard.
    this.cargarDatosDelDashboard();
  }

  obtenerNombreUsuario(): void {
    const token = this.authService.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const username = payload.email.split('@')[0];
        this.nombreUsuario = username.charAt(0).toUpperCase() + username.slice(1);
      } catch (error) {
        this.nombreUsuario = 'Usuario';
      }
    }
  }

  cargarDatosDelDashboard(): void {
    this.cargando = true;
    this.herramientaService.getHerramientas().subscribe({
      next: (herramientas) => {
        this.totalHerramientas = herramientas.length;
        // La lógica correcta para "requieren atención" es todo lo que no esté en estado óptimo
        this.requierenAtencion = herramientas.filter(h => h.estado !== 'Disponible' && h.estado !== 'Almacenado').length;
        this.cargando = false;
      },
      error: (err) => {
        console.error("Error al cargar los datos del dashboard:", err);
        this.cargando = false;
      }
    });
  }
}