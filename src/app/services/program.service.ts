import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Program } from '../components/interfaces/Program';

@Injectable({ providedIn: 'root' })
export class ProgramService {
  private apiUrl = `${environment.apiUrl}/programs`;

  constructor(private http: HttpClient) {}

  getAllPrograms(): Observable<Program[]> {
    return this.http.get<Program[]>(this.apiUrl);
  }
}
