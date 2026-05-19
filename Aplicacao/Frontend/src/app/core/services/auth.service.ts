import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, UserRole } from '../models/api-models';

const TOKEN_KEY = 'moedaestudantil.token';
const USER_KEY = 'moedaestudantil.user';
const API_BASE = 'http://localhost:8080/api';

export interface CurrentUser {
  id: number;
  nome: string;
  tipoUsuario: UserRole;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_BASE}/auth/login`, credentials).pipe(
      tap((res) => {
        localStorage.setItem(TOKEN_KEY, res.token);
        const user: CurrentUser = {
          id: res.usuarioId,
          nome: res.nome,
          tipoUsuario: res.tipoUsuario,
        };
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getCurrentUser(): CurrentUser | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as CurrentUser) : null;
  }

  updateCurrentUserName(nome: string): void {
    const user = this.getCurrentUser();
    if (!user) return;
    localStorage.setItem(USER_KEY, JSON.stringify({ ...user, nome }));
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
