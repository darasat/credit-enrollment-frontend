import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../components/interfaces/Student';
import { environment } from '../environments/environment';
import { SubjectTeacher } from '../components/interfaces/Subject';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private apiUrl = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) {}

  // Método para registrar estudiantes
  registerStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student);
  }

   // Método para registrar la relación estudiante-materia-profesor
  registerSubjectTeachers(subjectTeacherRecords: { studentId: number; subjectId: number; professorId: number }[]): Observable<void> {
    // Endpoint para registrar las relaciones de materias y profesores
    return this.http.post<void>(`${this.apiUrl}/register-subject-teachers`, subjectTeacherRecords);
  }

  // Obtener todos los estudiantes
  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  // Obtener estudiante por ID
  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

 assignSubjects(subjectTeacherRecords: SubjectTeacher[]): Observable<any> {
  return this.http.post(`${this.apiUrl}/assign-subjects`, subjectTeacherRecords);
  }

  getSharedStudents(studentId: number): Observable<Student[]> {
  return this.http.get<Student[]>(`${this.apiUrl}/${studentId}/shared-students`);
 }
}
