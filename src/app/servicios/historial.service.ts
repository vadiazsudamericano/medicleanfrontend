// RUTA: src/app/servicios/historial.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// --- ¡INTERFAZ ACTUALIZADA! ---
// Ahora esperamos un objeto 'herramienta' que contiene el nombre.
export interface HistorialEntry {
  id: number;
  herramienta: {
    id: number;
    nombre: string;
  };
  estadoAlEscanear: string;
  fechaEscaneo: Date;
}

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  private apiUrl = 'http://localhost:3000/historial';

  constructor(private http: HttpClient) { }

  getHistorial(): Observable<HistorialEntry[]> {
    return this.http.get<HistorialEntry[]>(this.apiUrl);
  }
  
  registrarEscaneo(datos: { herramientaId: number; estadoAlEscanear: string }): Observable<any> {
    return this.http.post(this.apiUrl, datos);
  }
}