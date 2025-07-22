// RUTA: src/app/app.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Importamos Router para redirigir
import { NavbarComponent } from './navbar/navbar'; // Importamos el Navbar para que se reconozca
import { AuthService } from './auth/auth.service';     // Importamos el servicio de autenticación

@Component({
  selector: 'app-root',
  standalone: true,
  // Asegúrate de que NavbarComponent esté en los imports
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MediClean'; // O el título que prefieras

  // 1. Inyectamos los servicios que necesitamos en el constructor
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * 2. ESTA ES LA FUNCIÓN QUE FALTABA.
   * Se ejecuta cuando el componente hijo (navbar) emite el evento 'logoutRequest'.
   */
  logoutGlobal(): void {
    console.log('AppComponent ha recibido la petición de logout desde el Navbar. Procediendo a cerrar sesión.');

    // Llama a la función logout de tu servicio de autenticación
    this.authService.logout();

    // Redirige al usuario a la página de login
    this.router.navigate(['/login']); // Asegúrate de que '/login' sea tu ruta de inicio de sesión
  }
}