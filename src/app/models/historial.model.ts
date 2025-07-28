export interface Herramienta {
  id: number;
  nombre: string;
}

export interface RegistroHistorial {
  id: number;
  estado: string;
  fecha: string;
  herramienta: Herramienta;
}