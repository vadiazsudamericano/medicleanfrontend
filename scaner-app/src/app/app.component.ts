// RUTA: src/app/app.component.ts

import { Component, ChangeDetectorRef, OnInit } from '@angular/core'; // 1. IMPORTA OnInit
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
// 2. IMPLEMENTA OnInit
export class AppComponent implements OnInit {
  
  public estaLogueado: boolean = false;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    // El constructor debe ser lo más simple posible.
    // Nos suscribimos a los eventos del router aquí.
    this.router.events.subscribe(() => {
      this.actualizarEstadoLogin();
    });
  }

  // 3. CREAMOS ngOnInit
  ngOnInit(): void {
    // Esta función es el lugar perfecto para la configuración inicial.
    // Llamamos a la función aquí por primera vez.
    this.actualizarEstadoLogin();
  }

  /**
   * Centralizamos la lógica de verificar el token en una función.
   */
  actualizarEstadoLogin(): void {
    const estadoActual = !!localStorage.getItem('token');
    if (this.estaLogueado !== estadoActual) {
      this.estaLogueado = estadoActual;
      // Forzamos la detección de cambios, ahora en un contexto seguro.
      this.cdr.detectChanges(); 
    }
  }

  /**
   * Esta función será llamada por el evento que emite el Navbar.
   */
  onLogout(): void {
    console.log('Cerrando sesión desde AppComponent...');
    localStorage.removeItem('token');
    this.actualizarEstadoLogin();
    this.router.navigate(['/login']);
  }
}