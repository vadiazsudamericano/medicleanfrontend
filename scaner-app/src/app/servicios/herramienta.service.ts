// RUTA: src/app/servicios/herramienta.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// ==============================================================
//               AQUÍ ESTÁ LA CORRECCIÓN
// Nos aseguramos de que esta interfaz incluya TODOS los campos
// que queremos usar en nuestro HTML y que vienen del backend.
// ==============================================================
export interface HerramientaBackend {
  id: number;
  nombre: string;
  descripcion?: string;
  estado?: string;
  // --- AÑADIMOS LAS PROPIEDADES QUE FALTABAN ---
  ultimoUso?: string;
  proximaEsterilizacion?: string;
}

@Injectable({
  providedIn: 'root',
})
export class HerramientaService {
  private api = 'http://localhost:3000/herramientas';

  constructor(private http: HttpClient) {}

  // ... (el resto del archivo se queda exactamente igual) ...

  getHerramientas(): Observable<HerramientaBackend[]> {
    return this.http.get<HerramientaBackend[]>(this.api);
  }

  crearHerramienta(data: any) {
    return this.http.post(this.api, data);
  }

  getHerramienta(id: number): Observable<HerramientaBackend> {
    return this.http.get<HerramientaBackend>(`${this.api}/${id}`);
  }

  getHerramientaPorNombre(nombre: string): Observable<HerramientaBackend | undefined> {
    return this.getHerramientas().pipe(
      map(herramientas =>
        herramientas.find(h => h.nombre.toLowerCase() === nombre.toLowerCase())
      )
    );
  }
}
