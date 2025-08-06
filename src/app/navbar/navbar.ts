// RUTA: src/app/navbar/navbar.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ThemeService } from '../servicios/theme.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class NavbarComponent {
  menuAbierto = false;
  currentTheme: 'dark' | 'cobalt';

  constructor(
    private themeService: ThemeService,
    private router: Router,
    private authService: AuthService
  ) {
    this.currentTheme = this.themeService.getTheme();
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }

  toggleTheme(): void {
    const next = this.currentTheme === 'dark' ? 'cobalt' : 'dark';
    this.themeService.setTheme(next);
    this.currentTheme = next;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.cerrarMenu();
  }
}
