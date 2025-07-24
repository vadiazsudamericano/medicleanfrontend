import { ApplicationConfig, importProvidersFrom } from '@angular/core'; // <-- Importamos 'importProvidersFrom'
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, HttpClient } from '@angular/common/http';


export function HttpLoaderFactory(http: HttpClient) {
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
  ]
};