import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';  // Asegúrate de que las rutas estén configuradas correctamente
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Importa los componentes standalone directamente
import { NavbarComponent } from './app/navbar/navbar';  // Importa el Navbar
import { DashboardComponent } from './app/dashboard/dashboard';  // Importa el Dashboard
import { EscanerComponent } from './app/escaner/escaner';  // Importa el Scan
import { PerfilComponent } from './app/perfil/perfil';  // Importa el Profile

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),  // Proporciona las rutas
    provideHttpClient(),
    importProvidersFrom(FormsModule),
    NavbarComponent,        // Incluye aquí los componentes standalone
    DashboardComponent,     // Incluye aquí los componentes standalone
    EscanerComponent,       // Incluye aquí los componentes standalone
    PerfilComponent,        // Incluye aquí los componentes standalone
  ],
}).catch(err => console.error(err));
