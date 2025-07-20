// RUTA: [Tu Proyecto de Frontend]/src/app/auth/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface RegisterPayload {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: string;
}

export interface LoginResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // --- ESTA ES LA LÍNEA IMPORTANTE ---
  // Apunta a la URL pública y segura (https) de tu backend en Railway.
  // Reemplaza esto con tu URL real.
  private apiBase = 'http://localhost:3000';


  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiBase}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          if (response && response.access_token) {
            localStorage.setItem('token', response.access_token);
          }
        })
      );
  }

  register(userData: RegisterPayload): Observable<any> {
    return this.http.post<any>(`${this.apiBase}/auth/register`, userData);
  }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  public logout(): void {
    localStorage.removeItem('token');
  }
}