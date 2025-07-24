// RUTA: src/app/configuracion/configuracion.ts

import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-configuracion',
  standalone: true,
  // Ya no importamos nada de ngx-translate aquí
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion.html',
  styleUrls: ['./configuracion.css']
})
export class ConfiguracionComponent implements OnInit {

  // Propiedades para los controles
  notificacionesEmail = true;
  modoOscuro = true;
  showSuccessMessage = false;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.cargarPreferencias();
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

    this.showSuccessMessage = true;
    setTimeout(() => { this.showSuccessMessage = false; }, 3000);
  }
  
  setTheme(isDark: boolean): void {
    this.modoOscuro = isDark;
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