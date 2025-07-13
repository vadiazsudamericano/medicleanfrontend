// RUTA: src/app/navbar/navbar.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  // 1. Creamos un emisor de eventos.
  // El decorador @Output() lo hace visible para el componente padre.
  @Output() logoutRequest = new EventEmitter<void>();

  constructor() {}

  /**
   * Esta función se llama cuando se hace clic en el botón de cerrar sesión.
   */
  onLogout(): void {
    console.log('Navbar está pidiendo cerrar sesión...');
    // 2. Emitimos el evento para que el padre (AppComponent) lo escuche.
    this.logoutRequest.emit();
  }
}