import { Routes } from '@angular/router';
import { StudentListComponent } from './components/student-list/student-list.component';
import { StudentRegisterComponent } from './components/student-register/student-register.component';

export const routes: Routes = [
  // Ruta por defecto que carga la lista de estudiantes
  { path: '', component: StudentListComponent },
  { path: 'register', component: StudentRegisterComponent },
];
