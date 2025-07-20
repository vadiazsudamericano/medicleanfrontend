
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  loginData = {
    email: '',      // ← CAMPO USADO COMO EMAIL
    password: ''
  };

  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    this.errorMessage = null;
    console.log('Intento de login con email:', this.loginData.email);

    // Usamos email como identificador (no username)
    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (response) => {
        console.log('Login exitoso!', response);
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        console.error('Error en el login:', err);
        this.errorMessage = 'Correo o contraseña incorrectos.';
      }
    });
  }
}
