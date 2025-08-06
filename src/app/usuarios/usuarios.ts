// RUTA: src/app/usuarios/usuarios.component.ts

import { Component, OnInit } from '@angular/core';
import { UserService, Usuario } from '../servicios/user.service';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  currentUserRol: string | null = null;

  // 👇 Notificación personalizada
  mensaje: string = '';
  tipoMensaje: 'success' | 'error' | 'warning' | '' = '';
  mostrarMensaje = false;

  // 👇 Variables para cambio de rol
  mostrarSelectRol = false;
  selectedUserId: number | null = null;
  nuevoRol: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserRol = this.authService.getUserRole();

    this.userService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: () => {
        this.mostrarNotificacion('Error al cargar usuarios', 'error');
      }
    });
  }

  eliminarUsuario(id: number): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.userService.eliminarUsuario(id).subscribe({
        next: () => {
          this.usuarios = this.usuarios.filter(u => u.id !== id);
          this.mostrarNotificacion('Usuario eliminado correctamente', 'success');
        },
        error: () => {
          this.mostrarNotificacion('No se pudo eliminar el usuario', 'error');
        }
      });
    }
  }

  mostrarSelector(id: number): void {
    this.mostrarSelectRol = true;
    this.selectedUserId = id;
    this.nuevoRol = '';
  }

  aplicarCambioRol(): void {
    if (!this.nuevoRol || !['admin', 'user'].includes(this.nuevoRol)) {
      this.mostrarNotificacion('Selecciona un rol válido', 'warning');
      return;
    }

    this.userService.actualizarRol(this.selectedUserId!, this.nuevoRol).subscribe({
      next: () => {
        this.mostrarNotificacion('Rol actualizado correctamente', 'success');
        this.mostrarSelectRol = false;
        this.selectedUserId = null;
        this.ngOnInit(); // Recarga usuarios
      },
      error: () => {
        this.mostrarNotificacion('Error al actualizar el rol', 'error');
      }
    });
  }

  cancelarCambio(): void {
    this.mostrarSelectRol = false;
    this.selectedUserId = null;
  }

  // 👇 Método para mostrar notificación flotante
  mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' | 'warning') {
    this.mensaje = mensaje;
    this.tipoMensaje = tipo;
    this.mostrarMensaje = true;
    setTimeout(() => this.mostrarMensaje = false, 3000);
  }
}
