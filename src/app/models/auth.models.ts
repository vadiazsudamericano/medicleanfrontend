// RUTA: src/app/models/auth.models.ts

// Define la estructura de la respuesta que esperamos del login
export interface LoginResponse {
  access_token: string;
}

// Define la estructura de los datos que enviamos para el registro
export interface RegisterPayload {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
}

// Define la estructura de los datos del perfil de usuario
export interface UserProfile {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  role: string;
}