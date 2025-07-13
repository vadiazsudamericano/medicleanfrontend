// RUTA: src/app/auth/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// ===============================================
//       AQUÍ ESTÁ LA CORRECCIÓN
// Añadimos 'export' para que otros archivos puedan
// importar y usar estas interfaces.
// ===============================================
export interface RegisterPayload {
  username: string;
  password: string;
  role: string;
  email: string;
}

export interface LoginResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiBase = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiBase}/auth/login`, { username, password })
      .pipe(
        tap(response => {
          if (response && response.access_token) {
            localStorage.setItem('token', response.access_token);
          }
        })
      );
  }

  register(userData: RegisterPayload): Observable<any> {
    return this.http.post<any>(`${this.apiBase}/users`, userData);
  }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  public logout(): void {
    localStorage.removeItem('token');
  }
}