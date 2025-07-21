// RUTA: src/app/perfil/perfil.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';

// Creamos una interfaz para darle una estructura clara a los datos del perfil
interface UserProfile {
  id: number;
  email: string;
  rol?: string; // El rol es opcional por ahora
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class PerfilComponent implements OnInit {
  
  user: UserProfile | null = null;
  errorMessage: string | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // Cuando el componente se carga, llamamos al servicio para obtener los datos del perfil
    this.authService.getProfile().subscribe({
      next: (profileData) => {
        // El backend nos devuelve un objeto como { sub: 3, email: '...' }
        // Lo transformamos para que coincida con nuestra interfaz UserProfile.
        this.user = {
          id: profileData.sub,
          email: profileData.email,
          rol: profileData.rol || 'Usuario Estándar' // Usamos un valor por defecto si el rol no viene
        };
      },
      error: (err) => {
        console.error('Error al obtener el perfil', err);
        this.errorMessage = 'No se pudo cargar la información del perfil. Por favor, intenta iniciar sesión de nuevo.';
      }
    });
  }

  // Lógica para el botón de eliminar
  eliminarCuenta() {
    if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      console.log('Lógica para eliminar cuenta aquí...');
      // Aquí en el futuro llamarías a un método en tu servicio:
      // this.authService.deleteAccount(this.user.id).subscribe(...);
    }
  }
}