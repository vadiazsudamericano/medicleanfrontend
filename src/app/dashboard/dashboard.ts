// RUTA: src/app/dashboard/dashboard.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HerramientaService, HerramientaBackend } from '../servicios/herramienta.service';
import { RegistroService, Registro } from '../servicios/registro.service';
import { jwtDecode } from 'jwt-decode';
import { trigger, style, transition, animate } from '@angular/animations';

interface UserTokenPayload { sub: number; username: string; role: string; }

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms 200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
    // ... añade otras animaciones si las necesitas ...
  ]
})
export class DashboardComponent implements OnInit {

  // Tus propiedades originales
  nombreUsuario: string = '';
  totalHerramientas: number = 0;
  requierenAtencion: number = 0;
  ultimosRegistros: Registro[] = [];
  cargando = true;

  constructor(
    private authService: AuthService,
    private herramientaService: HerramientaService,
    private registroService: RegistroService
  ) {}

  ngOnInit(): void {
    // 1. Obtener el nombre del usuario del token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<UserTokenPayload>(token);
        const username = decodedToken.username.split('@')[0];
        this.nombreUsuario = username.charAt(0).toUpperCase() + username.slice(1);
      } catch (error) {
        this.nombreUsuario = 'Usuario';
      }
    }

    // 2. Cargar los datos de las herramientas
    this.herramientaService.getHerramientas().subscribe(herramientas => {
      this.totalHerramientas = herramientas.length;
      this.requierenAtencion = herramientas.filter(h => h.estado !== 'Esterilizado y listo para usar').length;
    });

    // 3. Cargar los registros recientes
    this.registroService.getRegistros().subscribe(registros => {
      // Ordenamos por fecha (más reciente primero) y tomamos los últimos 5
      this.ultimosRegistros = registros
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        .slice(0, 5);
      
      this.cargando = false;
    });
  }
  
  /**
   * Genera una clase CSS a partir del string de evento para colorear los tags.
   * @param evento El string del evento (ej. "En Uso").
   * @returns Una clase CSS formateada (ej. "tag-en-uso").
   */
  getEventClass(evento: string): string {
    if (!evento) return 'tag-desconocido';
    return 'tag-' + evento.toLowerCase().replace(/\s+/g, '-');
  }
}