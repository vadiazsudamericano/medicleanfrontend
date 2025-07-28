// RUTA: src/app/register/register.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { RegisterPayload } from '../models/auth.models'; // <-- ¡IMPORTACIÓN CORREGIDA!

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  
  registerData: RegisterPayload = {
    nombre: '',
    apellido: '',
    email: '',
    password: ''
  };

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    const payload: RegisterPayload = this.registerData;

    this.authService.register(payload).subscribe({
      next: (response) => {
        this.successMessage = '¡Registro exitoso! Serás redirigido al login.';
        this.errorMessage = null;
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        this.errorMessage = 'No se pudo completar el registro. El correo ya podría estar en uso.';
        this.successMessage = null;
      }
    });
  }
}