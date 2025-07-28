// RUTA: src/app/servicios/user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// ✅ Interfaz exportada correctamente
export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  role: string;

}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://backend-restablecido-production.up.railway.app/users'; // ✅ Asegúrate que sea la URL correcta

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    const token = localStorage.getItem('access_token'); // ✅ correcto
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Usuario[]>(this.apiUrl, { headers });
  }

  eliminarUsuario(id: number): Observable<any> {
    const token = localStorage.getItem('access_token'); // ✅ correcto || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}
