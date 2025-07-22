// RUTA: src/app/app.routes.ts (Versión Corregida y Optimizada)

import { Routes } from '@angular/router';

// --- 1. IMPORTACIONES DE COMPONENTES ---
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { AuthGuard } from './auth/auth-guard';

// Se quita BienvenidaComponent porque el Dashboard será la nueva bienvenida
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
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // --- GRUPO 2: RUTAS PROTEGIDAS (Renderizadas dentro de MainLayout) ---
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // { path: 'bienvenida', component: BienvenidaComponent }, // <-- 1. ELIMINAMOS ESTA LÍNEA
      { path: 'inicio', component: DashboardComponent },
      { path: 'escaner', component: EscanerComponent },
      { path: 'historial', component: HistorialComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'configuracion', component: ConfiguracionComponent },
      { path: 'herramientas', component: HerramientaComponent },
      { path: 'registrar-herramienta', component: RegistrarHerramientaComponent },
      { path: 'detalle-herramienta/:nombre', component: DetalleHerramientaComponent },
      
      // --- CAMBIO CLAVE ---
      // 2. AHORA, la página por defecto para usuarios logueados es el DASHBOARD.
      { path: '', redirectTo: 'inicio', pathMatch: 'full' }
    ]
  },

  // --- RUTA "CATCH-ALL" ---
  { path: '**', redirectTo: '', pathMatch: 'full' }
];