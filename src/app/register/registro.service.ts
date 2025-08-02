import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private apiUrl = 'https://backend-restablecido-production.up.railway.app/auth/register';
 // Ajusta si tu backend usa otra ruta

  constructor(private http: HttpClient) {}

  guardarRegistro(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  obtenerRegistros(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
