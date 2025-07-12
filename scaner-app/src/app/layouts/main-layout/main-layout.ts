// RUTA: src/app/layouts/main-layout/main-layout.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar'; // Ajusta la ruta si es necesario

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css']
})
export class MainLayoutComponent {

  constructor(private router: Router) {}

  onLogout(): void {
    console.log('Cerrando sesión desde MainLayout...');
    localStorage.removeItem('token'); // O llama a tu AuthService.logout()
    this.router.navigate(['/login']);
  }
}