// RUTA: src/app/configuracion/configuracion.ts

import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion.html',
  styleUrls: ['./configuracion.css']
})
export class ConfiguracionComponent implements OnInit {

  // Propiedades para los controles
  notificacionesEmail = true;
  selectedLanguage = 'es';
  modoOscuro = true; // El modo oscuro será el predeterminado
  
  showSuccessMessage = false;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.cargarPreferencias();
    // Aplicamos el tema guardado en cuanto la página carga
    this.aplicarModoOscuro(); 
  }

  cargarPreferencias(): void {
    const notificacionesGuardadas = localStorage.getItem('notificaciones-email');
    if (notificacionesGuardadas !== null) {
      this.notificacionesEmail = JSON.parse(notificacionesGuardadas);
    }

    const idiomaGuardado = localStorage.getItem('app-language');
    if (idiomaGuardado) {
      this.selectedLanguage = idiomaGuardado;
    }

    const modoOscuroGuardado = localStorage.getItem('modo-oscuro');
    if (modoOscuroGuardado !== null) {
      this.modoOscuro = JSON.parse(modoOscuroGuardado);
    }
  }

  guardarPreferencias(): void {
    localStorage.setItem('notificaciones-email', JSON.stringify(this.notificacionesEmail));
    localStorage.setItem('app-language', this.selectedLanguage);
    localStorage.setItem('modo-oscuro', JSON.stringify(this.modoOscuro));

    // Mostramos el mensaje de feedback
    this.showSuccessMessage = true;
    setTimeout(() => { this.showSuccessMessage = false; }, 3000);
  }
  
  // --- LÓGICA DEL CAMBIO DE TEMA Y LENGUAJE ---
  
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

  onLanguageChange(): void {
    // Aquí iría la lógica para cambiar el idioma de la aplicación.
    // Por ahora, solo mostraremos un mensaje.
    alert(`Idioma cambiado a: ${this.selectedLanguage}. (Funcionalidad de traducción no implementada)`);
  }
}