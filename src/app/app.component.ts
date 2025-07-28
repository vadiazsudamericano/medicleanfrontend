// RUTA: src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar';
import { AuthService } from './auth/auth.service';
import { ThemeService } from './servicios/theme.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MediClean';

  constructor(
  private authService: AuthService,
  private router: Router,
  private themeService: ThemeService
) {
  const savedTheme = localStorage.getItem('theme') || 'theme-dark';
  document.body.classList.add(savedTheme);

  const highContrast = localStorage.getItem('contrast') === 'true';
  if (highContrast) document.body.classList.add('high-contrast');
}

  logoutGlobal(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}