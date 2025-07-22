// RUTA: src/app/dashboard/dashboard.ts
import { Component, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HerramientaService } from '../servicios/herramienta.service';
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
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms 200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {

  // Tu lógica original de datos se mantiene intacta
  nombreUsuario: string = '';
  totalHerramientas: number = 0;
  requierenAtencion: number = 0;
  ultimosRegistros: Registro[] = [];
  cargando = true;

  constructor(
    private authService: AuthService,
    private herramientaService: HerramientaService,
    private registroService: RegistroService,
    private el: ElementRef // Inyectamos ElementRef para los efectos
  ) {}

  ngOnInit(): void {
    // Tu lógica de carga original
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

    this.herramientaService.getHerramientas().subscribe(herramientas => {
      this.totalHerramientas = herramientas.length;
      this.requierenAtencion = herramientas.filter(h => h.estado !== 'Esterilizado y listo para usar').length;
    });

    this.registroService.getRegistros().subscribe(registros => {
      this.ultimosRegistros = registros
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        .slice(0, 5);
      this.cargando = false;
    });
  }

  // --- FUNCIÓN AÑADIDA PARA EL EFECTO DE LUZ INTERACTIVO ---
  onMouseMove(event: MouseEvent) {
    const cards = this.el.nativeElement.querySelectorAll('.info-card');
    cards.forEach((card: HTMLElement) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    });
  }
}