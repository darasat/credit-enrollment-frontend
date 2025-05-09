import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) {}

  // Método para registrar estudiantes
  registerStudent(student: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, student);
  }

  // Obtener todos los estudiantes
  getAllStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Obtener estudiante por ID
  getStudentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
