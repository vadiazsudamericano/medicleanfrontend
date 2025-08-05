import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definimos una 'interfaz' para decirle a Angular cómo son los datos de temperatura
export interface LecturaTemperatura {
  id: number;
  valor: number;
  fechaLectura: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TemperaturaService {
  // IMPORTANTE: La URL de nuestro backend. Nota que no usamos la ruta /api
  private backendUrl = 'https://backend-restablecido-production.up.railway.app/temperatura';

  constructor(private http: HttpClient) { }

  // Este método pide las últimas lecturas al backend
  // Devuelve un "Observable", que es el stream de datos de Angular
  getUltimaLectura(): Observable<LecturaTemperatura[]> {
    return this.http.get<LecturaTemperatura[]>(this.backendUrl);
  }
}