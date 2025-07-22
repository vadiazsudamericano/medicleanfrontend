// RUTA: src/app/configuracion/configuracion.ts

import { Component, OnInit } from '@angular/core';
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

  // --- Propiedades para los controles del formulario ---
  notificacionesEmail = true;
  selectedLanguage = 'es';
  historyLoadAmount = '50';
  
  showSuccessMessage = false;

  constructor() { }

  ngOnInit(): void {
    this.cargarPreferencias();
  }

  cargarPreferencias(): void {
    // Cargar Notificaciones
    const notificacionesGuardadas = localStorage.getItem('notificaciones-email');
    if (notificacionesGuardadas !== null) {
      this.notificacionesEmail = JSON.parse(notificacionesGuardadas);
    }

    // Cargar Idioma
    const idiomaGuardado = localStorage.getItem('app-language');
    if (idiomaGuardado) {
      this.selectedLanguage = idiomaGuardado;
    }

    // Cargar Cantidad de Historial
    const historialGuardado = localStorage.getItem('history-load-amount');
    if (historialGuardado) {
      this.historyLoadAmount = historialGuardado;
    }
  }

  guardarPreferencias(): void {
    localStorage.setItem('notificaciones-email', JSON.stringify(this.notificacionesEmail));
    localStorage.setItem('app-language', this.selectedLanguage);
    localStorage.setItem('history-load-amount', this.historyLoadAmount);

    // Mostramos el mensaje de feedback
    this.showSuccessMessage = true;
    setTimeout(() => { this.showSuccessMessage = false; }, 3000);
  }
  
  onClearCache(): void {
    // Simulamos la acción con un mensaje para el usuario
    if (confirm('¿Estás seguro de que quieres borrar la caché de reconocimiento? Esta acción es segura.')) {
      alert('Caché de reconocimiento borrada con éxito.');
      // En una app real, aquí llamarías a un servicio
    }
  }
}