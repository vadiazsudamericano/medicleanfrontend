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
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }

  eliminarUsuario(id: number): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.userService.eliminarUsuario(id).subscribe({
        next: () => {
          this.usuarios = this.usuarios.filter(u => u.id !== id);
        },
        error: (err) => {
          console.error('Error al eliminar usuario:', err);
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
    if (this.nuevoRol === 'admin' || this.nuevoRol === 'user') {
      this.userService.actualizarRol(this.selectedUserId!, this.nuevoRol).subscribe({
        next: () => {
          alert('Rol actualizado correctamente');
          this.mostrarSelectRol = false;
          this.selectedUserId = null;
          this.ngOnInit();
        },
        error: (err) => {
          alert('Error al actualizar rol: ' + err.error?.message || err.message);
        }
      });
    } else {
      alert('Selecciona un rol válido.');
    }
  }
}
