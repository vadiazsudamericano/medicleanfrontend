// RUTA: src/app/perfil/perfil.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { jwtDecode } from 'jwt-decode';

interface UserTokenPayload { sub: number; username: string; role: string; }

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class PerfilComponent implements OnInit {
  usuario: UserTokenPayload | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        this.usuario = jwtDecode<UserTokenPayload>(token);
      } catch (error) {
        console.error("Token inválido, cerrando sesión:", error);
        this.authService.logout();
      }
    }
  }

  onEditar = (campo: string) => alert(`Función para editar "${campo}" no implementada.`);
  onEliminarCuenta = () => confirm('¿Seguro que quieres eliminar tu cuenta?') && alert('Función no implementada.');
}