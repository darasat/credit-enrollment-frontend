import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Professor } from '../components/interfaces/Professor';

@Injectable({ providedIn: 'root' })
export class ProfessorService {
  private apiUrl = `${environment.apiUrl}/professors`;

  constructor(private http: HttpClient) {}

  getAllTeachers(): Observable<Professor[]> {
    return this.http.get<Professor[]>(this.apiUrl);
  }


  assignProfessorToSubject(subjectId: number, teacherId: number): Observable<any> {
    const body = { subjectId, teacherId };  // O lo que necesites pasar
    return this.http.post<any>(`${this.apiUrl}/assign`, body);
  }

  getAssignedTeacherForSubject(subjectId: number): Observable<Professor> {
  return this.http.get<Professor>(`${this.apiUrl}/assigned-to-subject/${subjectId}`);
}
}