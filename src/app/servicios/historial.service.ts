// src/app/servicios/historial.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  private apiUrl = 'https://backend-restablecido-production.up.railway.app/historial';

  constructor(private http: HttpClient) {}

  registrarEscaneo(data: {
    herramientaId: number;
    accion: string;
    referenciaVisual: string;
  }) {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('❌ No se encontró token para historial');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(this.apiUrl, data, { headers });
  }

  getHistorial() {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any[]>(this.apiUrl, { headers });
  }
}
