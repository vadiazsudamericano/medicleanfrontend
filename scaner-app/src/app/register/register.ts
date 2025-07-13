// RUTA: src/app/register/register.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, RegisterPayload } from '../auth/auth.service'; // Importamos la interfaz

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  registerData = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  };

  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    // Creamos el objeto con la estructura que el servicio espera
    const payload: RegisterPayload = {
      username: this.registerData.email,
      password: this.registerData.password,
      role: 'user', // Rol por defecto
      email: this.registerData.email
    };
    
    this.authService.register(payload).subscribe({
      next: (response: any) => {
        console.log('Registro exitoso:', response);
        this.successMessage = '¡Cuenta creada! Serás redirigido al login...';
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err: any) => {
        console.error('Error en el registro:', err);
        this.errorMessage = err.error?.message || 'El correo electrónico ya está en uso.';
      }
    });
  }
}