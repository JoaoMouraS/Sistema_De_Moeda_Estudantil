import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DistribuirMoedasRequest,
  ExtratoResponse,
  ProfessorResponse,
  TransacaoResponse
} from '../models/api-models';

const API_BASE = 'http://localhost:8080/api/professores';

@Injectable({ providedIn: 'root' })
export class ProfessorService {
  private http = inject(HttpClient);

  getMe(): Observable<ProfessorResponse> {
    return this.http.get<ProfessorResponse>(`${API_BASE}/me`);
  }

  getById(id: number): Observable<ProfessorResponse> {
    return this.http.get<ProfessorResponse>(`${API_BASE}/${id}`);
  }

  getExtrato(id: number): Observable<ExtratoResponse> {
    return this.http.get<ExtratoResponse>(`${API_BASE}/${id}/extrato`);
  }

  distribuir(id: number, dto: DistribuirMoedasRequest): Observable<TransacaoResponse> {
    return this.http.post<TransacaoResponse>(`${API_BASE}/${id}/distribuir`, dto);
  }
}
