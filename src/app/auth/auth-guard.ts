// RUTA: src/app/auth/auth-guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    
    // --- ESPÍA DE DIAGNÓSTICO ---
    const token = localStorage.getItem('token');
    console.log(`4. [AuthGuard] Revisando la ruta... ¿Token en localStorage?: "${token}"`);
    // ----------------------------

    if (this.authService.isLoggedIn()) {
      console.log('5. [AuthGuard] Decisión: PERMITIDO. El usuario puede pasar.');
      return true;
    } else {
      console.warn('6. [AuthGuard] Decisión: DENEGADO. El usuario no tiene permiso. Redirigiendo a /login...');
      this.router.navigate(['/login']);
      return false;
    }
  }
}