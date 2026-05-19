import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentProfile, TransacaoResponse, UpdateProfileRequest } from '../models/api-models';

const API_BASE = 'http://localhost:8080/api/students';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private http = inject(HttpClient);

  getStudentProfile(studentId: number): Observable<StudentProfile> {
    return this.http.get<StudentProfile>(`${API_BASE}/${studentId}/profile`);
  }

  updateStudentProfile(studentId: number, data: UpdateProfileRequest): Observable<StudentProfile> {
    return this.http.put<StudentProfile>(`${API_BASE}/${studentId}/profile`, data);
  }

  getStudentTransactions(studentId: number): Observable<TransacaoResponse[]> {
    return this.http.get<TransacaoResponse[]>(`${API_BASE}/${studentId}/extrato`);
  }
}
