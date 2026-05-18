import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AlunoService } from '../../core/services/aluno.service';
import { AuthService } from '../../core/services/auth.service';
import { AlunoResponse } from '../../core/models/api-models';

@Component({
  standalone: true,
  selector: 'app-aluno-list',
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  template: `
    <div class="dashboard-container">
      
      <nav class="admin-navbar">
        <div class="nav-brand">
          <i class='bx bx-shield-quarter'></i>
          StudentCoins <span>Admin</span>
        </div>
        <div class="nav-links">
          <a routerLink="/alunos" class="active"><i class='bx bxs-graduation'></i> Alunos</a>
          <a routerLink="/empresas"><i class='bx bxs-buildings'></i> Empresas</a>
          <button class="logout-btn" (click)="logout()">
            <i class='bx bx-log-out'></i> Sair
          </button>
        </div>
      </nav>

      <main class="content">
        <div class="card">
          <div class="card-header">
            <div>
              <h2>Gestão de Alunos</h2>
              <p class="subtitle">Acompanhe e gerencie todos os estudantes cadastrados na plataforma.</p>
            </div>
            
            <button mat-flat-button color="primary" routerLink="/alunos/novo" *ngIf="isAdmin" class="add-btn">
              <mat-icon>add</mat-icon> Cadastrar Aluno
            </button>
          </div>

          @if (loading()) {
            <mat-spinner class="center" diameter="48"></mat-spinner>
          } @else if (alunos().length === 0) {
            <div class="empty-state">
              <i class='bx bx-folder-open'></i>
              <p>Nenhum aluno cadastrado no sistema ainda.</p>
            </div>
          } @else {
            <div class="table-responsive">
              <table mat-table [dataSource]="alunos()" class="full-width">
                <ng-container matColumnDef="nome">
                  <th mat-header-cell *matHeaderCellDef>Nome</th>
                  <td mat-cell *matCellDef="let a"><strong>{{ a.nome }}</strong></td>
                </ng-container>
                
                <ng-container matColumnDef="email">
                  <th mat-header-cell *matHeaderCellDef>Email</th>
                  <td mat-cell *matCellDef="let a">{{ a.email }}</td>
                </ng-container>
                
                <ng-container matColumnDef="cpf">
                  <th mat-header-cell *matHeaderCellDef>CPF</th>
                  <td mat-cell *matCellDef="let a">{{ a.cpf }}</td>
                </ng-container>
                
                <ng-container matColumnDef="curso">
                  <th mat-header-cell *matHeaderCellDef>Curso</th>
                  <td mat-cell *matCellDef="let a"><span class="badge">{{ a.curso }}</span></td>
                </ng-container>
                
                <ng-container matColumnDef="instituicao">
                  <th mat-header-cell *matHeaderCellDef>Instituição</th>
                  <td mat-cell *matCellDef="let a">{{ a.instituicaoNome }}</td>
                </ng-container>
                
                <ng-container matColumnDef="saldo">
                  <th mat-header-cell *matHeaderCellDef>Saldo</th>
                  <td mat-cell *matCellDef="let a" class="coin-text">
                    <i class='bx bx-coin-stack'></i> {{ a.saldoMoedas }}
                  </td>
                </ng-container>
                
                <ng-container matColumnDef="acoes">
                  <th mat-header-cell *matHeaderCellDef class="text-right">Ações</th>
                  <td mat-cell *matCellDef="let a" class="text-right">
                    <button mat-icon-button color="primary" (click)="editar(a.id)" matTooltip="Editar Aluno">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="excluir(a)" matTooltip="Excluir Definitivamente">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="cols"></tr>
                <tr mat-row *matRowDef="let row; columns: cols" class="table-row"></tr>
              </table>
            </div>
          }
        </div>
      </main>

    </div>
  `,
  styles: [`
    @import url('https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css');

    .dashboard-container { min-height: 100vh; background-color: #f4f7f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    
    /* Navbar */
    .admin-navbar { display: flex; justify-content: space-between; align-items: center; background-color: #fff; padding: 15px 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .nav-brand { font-size: 22px; font-weight: bold; color: var(--primary, #1e3c72); display: flex; align-items: center; gap: 8px; }
    .nav-brand span { color: #666; font-weight: 400; }
    
    .nav-links { display: flex; align-items: center; gap: 15px; }
    .nav-links a { text-decoration: none; color: #666; font-weight: 600; font-size: 15px; padding: 10px 18px; border-radius: 8px; display: flex; align-items: center; gap: 6px; transition: 0.3s; }
    .nav-links a i { font-size: 18px; }
    .nav-links a:hover { background-color: #f0f4f8; color: var(--primary, #1e3c72); }
    .nav-links a.active { background-color: var(--primary, #1e3c72); color: #fff; }
    
    .logout-btn { background: #ffebee; color: #d32f2f; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 15px; transition: 0.3s; margin-left: 10px; }
    .logout-btn i { font-size: 18px; }
    .logout-btn:hover { background: #d32f2f; color: #fff; }

    /* Content & Card */
    .content { padding: 40px; max-width: 1250px; margin: 0 auto; }
    .card { background: #fff; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.04); padding: 30px; overflow: hidden; }
    
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; flex-wrap: wrap; gap: 15px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
    .card-header h2 { margin: 0; font-size: 24px; color: #333; }
    .subtitle { margin: 5px 0 0; color: #777; font-size: 14px; }
    
    .add-btn { padding: 5px 20px; border-radius: 8px; font-weight: 600; letter-spacing: 0.5px; }

    /* Table Styles */
    .table-responsive { width: 100%; overflow-x: auto; }
    .full-width { width: 100%; }
    .table-row:hover { background-color: #f9fbfd; }
    th.mat-header-cell { font-size: 13px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #eee; }
    td.mat-cell { font-size: 14px; color: #444; border-bottom: 1px solid #f0f0f0; padding: 15px 0; }
    
    .badge { background: #e3f2fd; color: #1565c0; padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .coin-text { color: #f39c12; font-weight: bold; display: flex; align-items: center; gap: 5px; }
    .text-right { text-align: right; }

    /* Empty State & Loader */
    .center { margin: 60px auto; display: block; }
    .empty-state { text-align: center; padding: 60px 20px; color: #888; }
    .empty-state i { font-size: 60px; color: #ccc; margin-bottom: 15px; }
    .empty-state p { font-size: 16px; margin: 0; }

    @media (max-width: 768px) {
      .admin-navbar { flex-direction: column; gap: 15px; padding: 15px 20px; }
      .nav-links { width: 100%; justify-content: space-between; }
      .content { padding: 20px; }
      .card { padding: 20px; }
    }
  `]
})
export class AlunoListComponent implements OnInit {
  private alunoService = inject(AlunoService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  alunos = signal<AlunoResponse[]>([]);
  loading = signal(true);
  
  isAdmin = false;
  cols = ['nome', 'email', 'cpf', 'curso', 'instituicao', 'saldo', 'acoes'];

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    this.isAdmin = user?.tipoUsuario?.toUpperCase() === 'ADMIN';

    if (!this.isAdmin) {
      this.router.navigate(['/home']);
      this.snack.open('Acesso negado. Esta área é restrita a administradores.', 'Fechar', { duration: 4000 });
      return;
    }

    this.carregar();
  }

  carregar() {
    this.loading.set(true);
    this.alunoService.listar().subscribe({
      next: (res) => {
        this.alunos.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snack.open('Erro ao carregar alunos.', 'Fechar', { duration: 4000 });
      },
    });
  }

  editar(id: number) {
    this.router.navigate(['/alunos', id, 'editar']);
  }

  excluir(a: AlunoResponse) {
    if (!confirm(`Excluir aluno "${a.nome}"?`)) return;
    this.alunoService.deletar(a.id).subscribe({
      next: () => {
        this.snack.open('Aluno excluído.', 'Fechar', { duration: 3000 });
        this.carregar();
      },
      error: (err) => {
        const msg = err?.error?.mensagem ?? 'Erro ao excluir aluno.';
        this.snack.open(msg, 'Fechar', { duration: 4000 });
      },
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}