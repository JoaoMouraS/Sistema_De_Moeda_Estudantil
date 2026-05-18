import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Interface para os dados do perfil do aluno
 */
export interface StudentProfile {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  rg: string;
  endereco?: string;
  curso: string;
  instituicaoId: number;
  instituicaoNome: string;
  saldoMoedas: number;
}

/**
 * Interface para requisição de atualização do perfil
 */
export interface UpdateProfileRequest {
  nome: string;
  email: string;
  endereco?: string;
  senha?: string;
}

/**
 * ProfileService - Serviço que comunica com a API do backend
 * 
 * Singleton: Uma única instância ao longo da vida da aplicação
 * HttpClient: Injetado automaticamente pelo Angular
 */
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/students';

  /**
   * Busca o perfil atual do aluno
   * 
   * @param studentId ID do aluno logado
   * @returns Observable<StudentProfile> com os dados do perfil
   */
  getStudentProfile(studentId: number): Observable<StudentProfile> {
    const url = `${this.apiUrl}/${studentId}/profile`;
    console.log('🌐 GET:', url);
    return this.http.get<StudentProfile>(url);
  }

  /**
   * Atualiza o perfil do aluno
   * 
   * @param studentId ID do aluno
   * @param data Dados para atualização
   * @returns Observable<StudentProfile> com os dados atualizados
   */
  updateStudentProfile(studentId: number, data: UpdateProfileRequest): Observable<StudentProfile> {
    const url = `${this.apiUrl}/${studentId}/profile`;
    console.log('🌐 PUT:', url);
    return this.http.put<StudentProfile>(url, data);
  }
}
