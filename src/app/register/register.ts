import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para ngModel y ngForm
import { Router, RouterLink } from '@angular/router'; // RouterLink para el enlace de login
import { AuthService, RegisterPayload } from '../auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // ¡Añadimos FormsModule y RouterLink!
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  
  // Objeto para almacenar los datos del formulario
  registerData: RegisterPayload = {
    nombre: '',
    apellido: '',
    email: '',
    password: ''
  };

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  // Esta función se ejecuta cuando el formulario se envía
  onSubmit(): void {
    // Creamos el payload a partir de los datos del formulario
    const payload: RegisterPayload = this.registerData;

    // Llamamos al método 'register' de nuestro servicio
    this.authService.register(payload).subscribe({
      next: (response) => {
        this.successMessage = '¡Registro exitoso! Serás redirigido al login.';
        this.errorMessage = null;
        
        // Esperamos un par de segundos para que el usuario vea el mensaje
        // y luego lo redirigimos a la página de login.
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        // Aquí podrías poner un mensaje de error más específico si el backend lo devuelve
        this.errorMessage = 'No se pudo completar el registro. El correo ya podría estar en uso.';
        this.successMessage = null;
      }
    });
  }
}