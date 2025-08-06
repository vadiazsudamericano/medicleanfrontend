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

  mostrarSelectRol = false;
  selectedUserId: number | null = null;
  nuevoRol: string = '';

  // 👇 Notificación
  mensaje: string = '';
  tipoMensaje: 'success' | 'error' | 'warning' = 'success';

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
      error: (err) => {
        this.mostrarNotificacion('Error al cargar usuarios', 'error');
        console.error(err);
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
        error: (err) => {
          this.mostrarNotificacion('No se pudo eliminar el usuario', 'error');
          console.error(err);
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
        this.ngOnInit(); // recargar usuarios
      },
      error: (err) => {
        this.mostrarNotificacion('Error al actualizar el rol', 'error');
        console.error(err);
      }
    });
  }

  cancelarCambio(): void {
    this.mostrarSelectRol = false;
    this.selectedUserId = null;
  }

  mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' | 'warning') {
    this.mensaje = mensaje;
    this.tipoMensaje = tipo;

    // Ocultar automáticamente después de 3 segundos
    setTimeout(() => {
      this.mensaje = '';
    }, 3000);
  }
}
