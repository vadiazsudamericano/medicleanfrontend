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
  proceso: string[]; 
  // ... añade aquí otros campos si vienen de tu backend
}

@Injectable({
  providedIn: 'root',
})
export class RegistroService {
  // Se utiliza la URL base de la API desde el archivo de entorno
  private apiBase = environment.apiUrl;
  // Se define la ruta específica para este servicio
  private apiRoute = `${this.apiBase}/registro-herramientas`;

  constructor(private http: HttpClient) {}

  /**
   * Crea un nuevo registro de evento para una herramienta.
   * @param data Datos del registro a crear.
   * @returns Un Observable con el registro creado.
   */
  registrar(data: any): Observable<Registro> {
    return this.http.post<Registro>(this.apiRoute, data);
  }

  /**
   * Obtiene todos los registros de eventos del historial.
   * @returns Un Observable con un array de todos los registros.
   */
  getRegistros(): Observable<Registro[]> {
    return this.http.get<Registro[]>(this.apiRoute);
  }

  /**
   * Obtiene todos los registros de eventos para una herramienta específica por su ID.
   * @param id El ID de la herramienta.
   * @returns Un Observable con un array de los registros de la herramienta.
   */
  getRegistrosPorHerramienta(id: number): Observable<Registro[]> {
    return this.http.get<Registro[]>(`${this.apiRoute}/herramienta/${id}`);
  }
}