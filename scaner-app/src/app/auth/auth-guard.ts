// RUTA: src/app/auth/auth-guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Llamamos a un método PÚBLICO del servicio que verifica si hay un token.
  if (authService.isLoggedIn()) {
    return true; // Si está logueado, permite el acceso.
  } else {
    // Si NO está logueado, lo redirigimos al login.
    console.log('AuthGuard: Acceso denegado. Redirigiendo a /login...');
    router.navigate(['/login']);
    return false; // Y denegamos el acceso a la ruta.
  }
};