// RUTA: src/app/servicios/herramienta.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz de herramienta
export interface HerramientaBackend {
  id: number;
  nombre: string;
  descripcion: string;
  uso: string;
  proceso: string[];
  estado: string;
  esterilizacion: string;
  ultimoUso?: string;
  proximaEsterilizacion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HerramientaService {
  private apiUrl = 'https://backend-restablecido-production.up.railway.app/herramientas';

  constructor(private http: HttpClient) {}

  // Obtener todas las herramientas
  getHerramientas(): Observable<HerramientaBackend[]> {
    return this.http.get<HerramientaBackend[]>(this.apiUrl);
  }

  // Crear nueva herramienta
  crearHerramienta(data: HerramientaBackend): Observable<HerramientaBackend> {
    return this.http.post<HerramientaBackend>(this.apiUrl, data);
  }

  // Buscar por nombre
  getHerramientaPorNombre(nombre: string): Observable<HerramientaBackend> {
  return this.http.get<HerramientaBackend>(`${this.apiUrl}/nombre/${encodeURIComponent(nombre)}`);
}



  // Buscar por ID
  getHerramientaPorId(id: number): Observable<HerramientaBackend> {
    return this.http.get<HerramientaBackend>(`${this.apiUrl}/${id}`);
  }
}
