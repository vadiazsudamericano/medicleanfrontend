// RUTA: src/app/usuarios/usuarios.component.ts

import { Component, OnInit } from '@angular/core';
import { UserService, Usuario } from '../servicios/user.service';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.currentUserRol = this.authService.getUserRole();

    this.userService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (err) => {
        this.toastr.error('Error al cargar usuarios', 'Error');
        console.error(err);
      }
    });
  }

  eliminarUsuario(id: number): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.userService.eliminarUsuario(id).subscribe({
        next: () => {
          this.usuarios = this.usuarios.filter(u => u.id !== id);
          this.toastr.success('Usuario eliminado correctamente', 'Éxito');
        },
        error: (err) => {
          this.toastr.error('No se pudo eliminar el usuario', 'Error');
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
      this.toastr.warning('Selecciona un rol válido', 'Advertencia');
      return;
    }

    this.userService.actualizarRol(this.selectedUserId!, this.nuevoRol).subscribe({
      next: () => {
        this.toastr.success('Rol actualizado correctamente', 'Éxito');
        this.mostrarSelectRol = false;
        this.selectedUserId = null;
        this.ngOnInit(); // Recarga usuarios
      },
      error: (err) => {
        this.toastr.error('Error al actualizar el rol', 'Error');
        console.error(err);
      }
    });
  }

  cancelarCambio(): void {
    this.mostrarSelectRol = false;
    this.selectedUserId = null;
  }
}
