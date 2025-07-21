// RUTA: src/app/auth/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface RegisterPayload {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // --- ESTA ES LA FUNCIÓN MÁS IMPORTANTE PARA EL GUARDIA ---
  // Revisa si existe un token en localStorage.
  // Devuelve 'true' si hay algo, 'false' si no hay nada (null).
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // El !! convierte un string en booleano (true si no es nulo/vacío)
  }

  getProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/profile`, { headers });
  }
}