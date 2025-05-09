import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';  // Asegúrate de tener este archivo de rutas

// Asegúrate de que `appConfig` contenga los proveedores necesarios
export const appConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes), // Si tienes rutas configuradas
    // Aquí puedes agregar más proveedores o interceptores si los necesitas
  ]
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
