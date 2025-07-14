// RUTA: src/app/servicios/registro.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaz para definir la estructura de un registro
export interface Registro {
  id: number;
  herramientaId: number;
  fecha: string;
  evento: string;
  responsable: string;
  // ... añade aquí otros campos si vienen de tu backend
}

@Injectable({
  providedIn: 'root',
})
export class RegistroService {
  private api = 'http://localhost:3000/registro-herramientas';

  constructor(private http: HttpClient) {}

  // --- Tus funciones existentes, ahora con tipos ---
  registrar(data: any): Observable<Registro> {
    return this.http.post<Registro>(this.api, data);
  }

  getRegistros(): Observable<Registro[]> {
    return this.http.get<Registro[]>(this.api);
  }

  getRegistrosPorHerramienta(id: number): Observable<Registro[]> {
    return this.http.get<Registro[]>(`${this.api}/herramienta/${id}`);
  }
}
