// RUTA: src/app/login/login.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  loginData = {
    email: '',
    password: ''
  };

  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  onLogin() {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Por favor, introduce el correo y la contraseña.';
      return;
    }

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        if (response && response.access_token) {
          localStorage.setItem('token', response.access_token);
          // --- ¡CAMBIO SUGERIDO! ---
          // Redirigimos a '/inicio' para que el usuario vea el nuevo y espectacular dashboard.
          this.router.navigate(['/inicio']);
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