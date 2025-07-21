// RUTA: src/app/login/login.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngIf
// --- ¡IMPORTACIONES CLAVE PARA FORMULARIOS Y RUTAS! ---
import { FormsModule } from '@angular/forms'; 
import { Router, RouterLink } from '@angular/router'; // RouterLink para el enlace de registro

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  // --- ¡AÑADIMOS LOS MÓDULOS A LA LISTA DE IMPORTS! ---
  imports: [
    CommonModule, 
    FormsModule,   // <-- Ahora el componente entiende ngModel, ngForm, etc.
    RouterLink     // <-- Ahora el componente entiende routerLink
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  // Objeto para almacenar los datos del formulario
  loginData = {
    email: '',
    password: ''
  };

  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  // Esta función se ejecuta cuando el formulario se envía
  onLogin() {
    // Verificación básica
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Por favor, introduce el correo y la contraseña.';
      return;
    }

    // Llamamos al servicio de login, pasándole el objeto completo
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        if (response && response.access_token) {
          // Si el login es exitoso, guardamos el token y navegamos
          localStorage.setItem('token', response.access_token);
          this.router.navigate(['/bienvenida']); // O a tu página de inicio
        } else {
          this.errorMessage = 'Respuesta de login inválida del servidor.';
        }
      },
      error: (err) => {
        console.error('Error en el login:', err);
        this.errorMessage = 'Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.';
      }
    });
  }
}