// RUTA: src/app/servicios/herramienta.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Esta interfaz define la estructura de datos de una herramienta
export interface HerramientaBackend {
  id: number;
  nombre: string;
  descripcion?: string;
  estado?: string;
  ultimoUso?: string;
  proximaEsterilizacion?: string;
}

@Injectable({
  providedIn: 'root',
})
export class HerramientaService {
  // Usamos la URL del entorno correcto (local o producción)
  private apiBase = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista completa de herramientas del backend.
   */
  getHerramientas(): Observable<HerramientaBackend[]> {
    // CORRECCIÓN: Usamos this.apiBase y la ruta correcta /herramientas
    return this.http.get<HerramientaBackend[]>(`${this.apiBase}/herramientas`);
  }

  /**
   * Envía los datos de una nueva herramienta al backend para crearla.
   */
  crearHerramienta(data: any): Observable<any> {
    // CORRECCIÓN: Usamos this.apiBase y la ruta correcta /herramientas
    return this.http.post(`${this.apiBase}/herramientas`, data);
  }

  /**
   * Obtiene los detalles de una única herramienta por su ID.
   */
  getHerramienta(id: number): Observable<HerramientaBackend> {
    // CORRECCIÓN: Usamos this.apiBase y la ruta correcta /herramientas/:id
    return this.http.get<HerramientaBackend>(`${this.apiBase}/herramientas/${id}`);
  }

  /**
   * Obtiene los detalles de una herramienta por su nombre.
   * (Esta función ya estaba bien, pero la incluyo para que el archivo esté completo).
   */
  getHerramientaPorNombre(nombre: string): Observable<HerramientaBackend | undefined> {
    return this.getHerramientas().pipe(
      map(herramientas =>
        herramientas.find(h => h.nombre.toLowerCase() === nombre.toLowerCase())
      )
    );
  }
}