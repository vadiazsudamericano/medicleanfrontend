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
  config = {
    notificacionesEmail: true,
    notificacionesPush: false,
    modoOscuro: false
  };

  ngOnInit(): void {
    // Al iniciar, cargamos la configuración guardada
    const guardado = localStorage.getItem('appConfig');
    if (guardado) {
      this.config = JSON.parse(guardado);
    }
  }

  guardarConfiguracion(): void {
    // Cada vez que se cambia una opción, guardamos todo el objeto
    localStorage.setItem('appConfig', JSON.stringify(this.config));
    console.log('Configuración guardada:', this.config);
  }
}