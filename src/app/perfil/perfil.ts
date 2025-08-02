// RUTA: src/app/perfil/perfil.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common'; // NgClass para los estilos del rol
import { Router } from '@angular/router'; // Lo necesitarás para futuras acciones

// --- ¡ESTAS SON LAS IMPORTACIONES CORREGIDAS! ---
import { AuthService } from '../auth/auth.service'; // Importamos el servicio
import { UserProfile } from '../models/auth.models'; // Importamos la interfaz desde su nuevo archivo

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, NgClass], // Asegúrate de que NgClass esté aquí
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class PerfilComponent implements OnInit {
  
  // Usamos el nombre 'userProfile' para ser consistentes con el servicio y la interfaz
  userProfile: UserProfile | null = null;
  errorMessage: string | null = null;
  

  constructor(
    private authService: AuthService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    // Cuando el componente se carga, llamamos al servicio para obtener los datos
    this.authService.getProfile().subscribe({
      next: (profileData) => {
        // Asignamos directamente la respuesta, ya que coincide con nuestra interfaz
        console.log('Perfil recibido:', profileData);
        this.userProfile = profileData;
      },
      error: (err) => {
        console.error('Error al obtener el perfil:', err);
        // Si el token es inválido (error 401), podríamos redirigir al login
        this.errorMessage = 'No se pudo cargar la información del perfil. Por favor, intenta iniciar sesión de nuevo.';
      }
    });
  }

  // Puedes añadir aquí futuras funciones, como 'editarPerfil' o 'cambiarContraseña'
  // por ejemplo:
  // goToEditProfile(): void {
  //   this.router.navigate(['/perfil/editar']);
  // }
}