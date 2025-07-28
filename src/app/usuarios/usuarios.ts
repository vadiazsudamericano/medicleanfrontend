import { Component, OnInit } from '@angular/core';
import { UserService, Usuario } from '../servicios/user.service';
import { AuthService } from '../auth/auth.service';
import { CommonModule} from '@angular/common';
@Component({
  selector: 'app-usuarios',
  imports:[CommonModule],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  currentUserRol: string | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserRol = this.authService.getUserRole(); // ← AQUÍ se obtiene el rol desde el token

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
}
