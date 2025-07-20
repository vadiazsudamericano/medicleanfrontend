// RUTA: src/app/servicios/herramienta.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// La interfaz es la misma para todos los componentes, la dejamos aquí
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
  // Apuntamos a la dirección real de tu backend local
  private apiUrl = 'http://localhost:3000/herramientas';

  constructor(private http: HttpClient) {}

  // --- MÉTODO RESTAURADO #1 (Para el Dashboard) ---
  // Esta función devuelve TODAS las herramientas.
  getHerramientas(): Observable<HerramientaBackend[]> {
    return this.http.get<HerramientaBackend[]>(this.apiUrl);
  }

  // --- MÉTODO RESTAURADO #2 (Para crear herramientas) ---
  // Esta función crea una nueva herramienta.
  crearHerramienta(data: HerramientaBackend): Observable<HerramientaBackend> {
    return this.http.post<HerramientaBackend>(this.apiUrl, data);
  }

  // --- MÉTODO PARA EL ESCÁNER (Este ya lo tenías) ---
  // Esta función busca una sola herramienta por su nombre.
  getHerramientaPorNombre(nombre: string): Observable<HerramientaBackend> {
    return this.http.get<HerramientaBackend>(`${this.apiUrl}/nombre/${nombre}`);
  }
}