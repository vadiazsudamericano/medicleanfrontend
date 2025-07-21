// RUTA: src/app/app.routes.ts (Versión Corregida y Simplificada)

import { Routes } from '@angular/router';

// --- 1. IMPORTACIONES DE COMPONENTES ---
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { AuthGuard } from './auth/auth-guard';

import { BienvenidaComponent } from './bienvenida/bienvenida';
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
  // --- GRUPO 1: RUTAS PÚBLICAS (Sin Navbar, sin protección) ---
  // Estas son las únicas páginas a las que se puede acceder sin iniciar sesión.
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // --- GRUPO 2: RUTAS PROTEGIDAS (Renderizadas dentro de MainLayout) ---
  // El AuthGuard protege TODO este bloque. Si no estás logueado, te enviará a /login.
  {
    path: '', // La ruta padre para todas las páginas internas
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // La página de bienvenida es la primera página protegida
      { path: 'bienvenida', component: BienvenidaComponent },
      { path: 'inicio', component: DashboardComponent }, // 'inicio' y 'dashboard' pueden ser la misma
      { path: 'escaner', component: EscanerComponent },
      { path: 'historial', component: HistorialComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'configuracion', component: ConfiguracionComponent },
      { path: 'herramientas', component: HerramientaComponent },
      { path: 'registrar-herramienta', component: RegistrarHerramientaComponent },
      { path: 'detalle-herramienta/:nombre', component: DetalleHerramientaComponent },
      
      // REDIRECCIÓN POR DEFECTO PARA USUARIOS LOGUEADOS:
      // Si un usuario ya logueado va a la raíz (ej. localhost:4200),
      // lo redirigimos a la página de bienvenida.
      { path: '', redirectTo: 'bienvenida', pathMatch: 'full' }
    ]
  },

  // --- RUTA "CATCH-ALL" ---
  // Si se introduce cualquier otra URL que no exista, se redirige a la raíz.
  // Si el usuario está logueado, el guardia lo enviará a /bienvenida.
  // Si no está logueado, el guardia lo enviará a /login.
  { path: '**', redirectTo: '', pathMatch: 'full' }
];