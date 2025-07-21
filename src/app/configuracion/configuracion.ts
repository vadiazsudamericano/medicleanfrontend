// RUTA: src/app/configuracion/configuracion.ts

import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
// --- ¡IMPORTAMOS FORMSMODULE! ---
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-configuracion',
  standalone: true,
  // --- ¡LO AÑADIMOS A LA LISTA DE IMPORTS! ---
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion.html',
  styleUrls: ['./configuracion.css']
})
export class ConfiguracionComponent implements OnInit {

  // Propiedades para vincularlas a los interruptores en el HTML
  notificacionesEmail = true;
  modoOscuro = false;

  // Inyectamos Renderer2 para manipular el body del documento de forma segura
  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.cargarPreferencias();
    // Es importante aplicar el modo oscuro al cargar,
    // para que si el usuario refresca la página, el tema se mantenga.
    this.aplicarModoOscuro(); 
  }

  cargarPreferencias(): void {
    const notificacionesGuardadas = localStorage.getItem('notificaciones-email');
    if (notificacionesGuardadas !== null) {
      this.notificacionesEmail = JSON.parse(notificacionesGuardadas);
    }

    const modoOscuroGuardado = localStorage.getItem('modo-oscuro');
    if (modoOscuroGuardado !== null) {
      this.modoOscuro = JSON.parse(modoOscuroGuardado);
    }
  }

  guardarPreferencias(): void {
    localStorage.setItem('notificaciones-email', JSON.stringify(this.notificacionesEmail));
    localStorage.setItem('modo-oscuro', JSON.stringify(this.modoOscuro));
  }

  onToggleNotificaciones(): void {
    console.log('Notificaciones por E-mail:', this.notificacionesEmail);
    this.guardarPreferencias();
  }

  onToggleModoOscuro(): void {
    console.log('Modo Oscuro:', this.modoOscuro);
    this.guardarPreferencias();
    this.aplicarModoOscuro();
  }
  
  aplicarModoOscuro(): void {
    if (this.modoOscuro) {
      this.renderer.addClass(document.body, 'dark-mode');
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
    }
  }
}