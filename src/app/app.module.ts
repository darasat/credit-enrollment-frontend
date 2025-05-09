import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [

  ],
  imports: [
    BrowserModule,               // Importa el módulo del navegador para la renderización
    CommonModule,                // Importa el CommonModule (requerido para ngFor, etc.)
    ReactiveFormsModule,
    RouterModule.forRoot([])     // Configura el enrutador para las rutas (ajústalo a tus necesidades)
  ],
 providers: [
    provideHttpClient(
      withFetch(),                // Alternativa a HttpClient (si prefieres fetch)
    )
  ],  
})
export class AppModule { }
