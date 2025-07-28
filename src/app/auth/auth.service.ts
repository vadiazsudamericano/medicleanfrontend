// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginResponse, RegisterPayload, UserProfile } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://backend-restablecido-production.up.railway.app';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.access_token);
      })
    );
  }

  register(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, payload);
  }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getProfile(): Observable<UserProfile> {
    const token = this.getToken();
    if (!token) {
      return new Observable(observer => observer.error('No se encontró el token de autenticación.'));
    }
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<UserProfile>(`${this.apiUrl}/auth/profile`, { headers });
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch (e) {
      console.error('Error al decodificar el token', e);
      return null;
    }
  }

  saveToken(token: string) {
    localStorage.setItem('access_token', token);
  }
}
