// RUTA: src/app/login/login.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Necesario para la directiva [(ngModel)]
import { AuthService } from '../auth/auth.service'; // Asegúrate de que la ruta a tu servicio sea correcta

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule // Importamos FormsModule para manejar los datos del formulario
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  // Objeto para almacenar los datos que el usuario introduce en el formulario
  loginData = {
    email: '',
    password: ''
  };

  // Variable para mostrar mensajes de error al usuario
  errorMessage: string | null = null;

  // Inyectamos el servicio de autenticación y el router para usarlos en este componente
  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  /**
   * Esta función se ejecuta cuando el usuario envía el formulario de login.
   */
  onLogin(): void {
    // Reiniciamos cualquier mensaje de error anterior
    this.errorMessage = null;

    // Mostramos en la consola con qué datos se está intentando hacer login (útil para depurar)
    console.log('Intento de login con email:', this.loginData.email);

    // Llamamos a la función 'login' del servicio de autenticación.
    // Le pasamos el email y la contraseña como dos argumentos separados.
    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      
      // 'next' se ejecuta si la respuesta del backend es exitosa (login correcto)
      next: (response) => {
        console.log('Login exitoso!', response);
        
        // Aquí es donde normalmente guardarías el token de autenticación
        // Ejemplo: localStorage.setItem('authToken', response.token);
        
        // Redirigimos al usuario a la página de inicio o dashboard
        this.router.navigate(['/inicio']); 
      },

      // 'error' se ejecuta si el backend devuelve un error (login incorrecto)
      error: (err) => {
        console.error('Error en el login:', err);
        this.errorMessage = 'Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.';
      }
    });
  }
}