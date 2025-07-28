// RUTA: src/app/services/historial.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

// --- INTERFACES PARA LOS DATOS DEL HISTORIAL ---
// Interfaz para los datos que RECIBIMOS del backend
export interface HistorialEntry {
  id: number;
  fechaEscaneo: string;
  estadoAlEscanear: string;
  herramienta: {
    id: number;
    nombre: string;
  };
}

// Interfaz para los datos que ENVIAMOS al backend para crear un registro
export interface CreateHistorialPayload {
  herramientaId: number;
  estadoAlEscanear: string;
}

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  private apiUrl = 'https://backend-restablecido-production.up.railway.app/historial';

  constructor(private http: HttpClient, private authService: AuthService) { }


  // ==========================================================
  // === ¡AÑADE ESTE NUEVO MÉTODO PARA SOLUCIONAR EL ERROR! ===
  // ==========================================================
  registrarEscaneo(payload: CreateHistorialPayload): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    
    // Hacemos una petición POST para crear el nuevo registro
    return this.http.post(this.apiUrl, payload, { headers });
  }
  getHistorial(): Observable<HistorialEntry[]> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  return this.http.get<HistorialEntry[]>(this.apiUrl, { headers });
}

}