import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmpresaService } from '../../core/services/empresa.service';
import { AuthService } from '../../core/services/auth.service';
import { EmpresaResponse } from '../../core/models/api-models';

@Component({
  standalone: true,
  selector: 'app-empresa-list',
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
          <a routerLink="/alunos"><i class='bx bxs-graduation'></i> Alunos</a>
          <a routerLink="/empresas" class="active"><i class='bx bxs-buildings'></i> Empresas</a>
          <button class="logout-btn" (click)="logout()">
            <i class='bx bx-log-out'></i> Sair
          </button>
        </div>
      </nav>

      <main class="content">
        <div class="card">
          <div class="card-header">
            <div>
              <h2>Gestão de Empresas Parceiras</h2>
              <p class="subtitle">Monitore os parceiros que oferecem vantagens e descontos na plataforma.</p>
            </div>
            
            <button mat-flat-button color="primary" routerLink="/empresas/novo" *ngIf="isAdmin" class="add-btn">
              <mat-icon>add</mat-icon> Nova Empresa
            </button>
          </div>

          @if (loading()) {
            <mat-spinner class="center" diameter="48"></mat-spinner>
          } @else if (empresas().length === 0) {
            <div class="empty-state">
              <i class='bx bx-store-alt'></i>
              <p>Nenhuma empresa parceira cadastrada no sistema ainda.</p>
            </div>
          } @else {
            <div class="table-responsive">
              <table mat-table [dataSource]="empresas()" class="full-width">
                <ng-container matColumnDef="nomeFantasia">
                  <th mat-header-cell *matHeaderCellDef>Nome Fantasia</th>
                  <td mat-cell *matCellDef="let e"><strong>{{ e.nomeFantasia }}</strong></td>
                </ng-container>
                
                <ng-container matColumnDef="cnpj">
                  <th mat-header-cell *matHeaderCellDef>CNPJ</th>
                  <td mat-cell *matCellDef="let e">
                    <span class="badge badge-gray">{{ e.cnpj }}</span>
                  </td>
                </ng-container>
                
                <ng-container matColumnDef="email">
                  <th mat-header-cell *matHeaderCellDef>Email</th>
                  <td mat-cell *matCellDef="let e">{{ e.email }}</td>
                </ng-container>
                
                <ng-container matColumnDef="descricao">
                  <th mat-header-cell *matHeaderCellDef>Descrição</th>
                  <td mat-cell *matCellDef="let e" class="truncate-text">{{ e.descricao || 'Não informada' }}</td>
                </ng-container>
                
                <ng-container matColumnDef="acoes">
                  <th mat-header-cell *matHeaderCellDef class="text-right">Ações</th>
                  <td mat-cell *matCellDef="let e" class="text-right">
                    <button mat-icon-button color="primary" (click)="editar(e.id)" matTooltip="Editar Empresa">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="excluir(e)" matTooltip="Excluir Definitivamente">
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
    
    .badge-gray { background: #f0f0f0; color: #555; padding: 5px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; font-family: monospace; letter-spacing: 1px; }
    .truncate-text { max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #777 !important; }
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
export class EmpresaListComponent implements OnInit {
  private empresaService = inject(EmpresaService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  empresas = signal<EmpresaResponse[]>([]);
  loading = signal(true);
  
  isAdmin = false;
  cols = ['nomeFantasia', 'cnpj', 'email', 'descricao', 'acoes'];

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
    this.empresaService.listar().subscribe({
      next: (res) => {
        this.empresas.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snack.open('Erro ao carregar empresas.', 'Fechar', { duration: 4000 });
      },
    });
  }

  editar(id: number) {
    this.router.navigate(['/empresas', id, 'editar']);
  }

  excluir(e: EmpresaResponse) {
    if (!confirm(`Excluir empresa "${e.nomeFantasia}"?`)) return;
    this.empresaService.deletar(e.id).subscribe({
      next: () => {
        this.snack.open('Empresa excluída.', 'Fechar', { duration: 3000 });
        this.carregar();
      },
      error: (err) => {
        const msg = err?.error?.mensagem ?? 'Erro ao excluir empresa.';
        this.snack.open(msg, 'Fechar', { duration: 4000 });
      },
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}