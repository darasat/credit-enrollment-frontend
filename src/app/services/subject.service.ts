import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Subject {
  name: string;
  professor: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
    private apiUrl = `${environment.apiUrl}/subject`;

  constructor(private http: HttpClient) {}

  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.apiUrl);
  }
}
