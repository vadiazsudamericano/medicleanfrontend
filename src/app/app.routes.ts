// RUTA: src/app/app.routes.ts (Versión Final de Producción)

import { Routes } from '@angular/router';

// --- 1. IMPORTACIONES DE COMPONENTES ---
// Layout, Páginas Públicas y el Guardián de Seguridad
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { RegisterComponent } from './register/register';
import { BienvenidaComponent } from './bienvenida/bienvenida';
import { authGuard } from './auth/auth-guard';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { EscanerComponent } from './escaner/escaner';
import { HistorialComponent } from './historial/historial';
import { PerfilComponent } from './perfil/perfil';
import { ConfiguracionComponent } from './configuracion/configuracion';
import { RegistrarHerramientaComponent } from './registrar-herramienta/registrar-herramienta';
import { DetalleHerramientaComponent } from './detalle-herramienta/detalle-herramienta';
import { HerramientaComponent } from './herramienta/herramienta';


// --- 2. DEFINICIÓN DE RUTAS ---
export const routes: Routes = [
  // --- GRUPO 1: RUTAS PÚBLICAS (Se renderizan solas, sin Navbar) ---
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'bienvenida', component: BienvenidaComponent },

  // --- GRUPO 2: RUTAS PROTEGIDAS (Se renderizan dentro del MainLayout, con Navbar) ---
  {
    path: '', // La ruta padre para todas las páginas internas
    component: MainLayoutComponent,
    canActivate: [authGuard], // El "portero" protege todo este grupo de rutas
    children: [
      { path: 'inicio', component: DashboardComponent },
      { path: 'escaner', component: EscanerComponent },
      { path: 'historial', component: HistorialComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'configuracion', component: ConfiguracionComponent },
      { path: 'herramientas', component: HerramientaComponent },
      { path: 'registrar-herramienta', component: RegistrarHerramientaComponent },
      { path: 'detalle-herramienta/:nombre', component: DetalleHerramientaComponent },
      
      // Si un usuario logueado va a la raíz (ej. localhost:4200), lo mandamos a 'inicio'
      { path: '', redirectTo: 'inicio', pathMatch: 'full' }
    ]
  },

  // --- RUTA DE REDIRECCIÓN FINAL ---
  // Si el usuario escribe una URL que no existe, lo mandamos a la página de bienvenida.
  { path: '**', redirectTo: '/bienvenida' }
];