// RUTA: src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MediClean';

  constructor(
    private authService: AuthService,
    private router: Router
    // Ya no inyectamos TranslateService aquí
  ) {}

  logoutGlobal(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}