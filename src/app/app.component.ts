import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // <-- Import RouterModule
import { StudentRegisterComponent } from './components/student-register/student-register.component'; // <-- Corrected file path
import { StudentListComponent } from './components/student-list/student-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,  // <-- Standalone component
  imports: [RouterModule] // <-- Add components here
 // <-- Add components here
  // <-- Add components here
})
export class AppComponent {
  title = 'App para registrar créditos Estudiantes';
}
