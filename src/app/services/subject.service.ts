import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Subject } from '../components/interfaces/Subject';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
    private apiUrl = `${environment.apiUrl}/subjects`;

  constructor(private http: HttpClient) {}

  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.apiUrl);
  }
}
