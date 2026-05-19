import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlunoService } from '../../core/services/aluno.service';
import { AlunoResponse } from '../../core/models/api-models';
import { AppShellComponent } from '../../shared/components/app-shell.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { CardComponent } from '../../shared/components/card.component';
import { ButtonComponent } from '../../shared/components/button.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';

@Component({
  standalone: true,
  selector: 'app-aluno-list',
  imports: [CommonModule, RouterLink, AppShellComponent, PageHeaderComponent, CardComponent, ButtonComponent, EmptyStateComponent],
  template: `
    <app-shell>
      <div class="container">
        <app-page-header
          title="Alunos"
          subtitle="Gerencie os estudantes cadastrados na plataforma."
        >
          <app-button variant="primary" routerLink="/alunos/novo">
            <span class="material-icons">add</span>
            Novo aluno
          </app-button>
        </app-page-header>

        <app-card [padded]="false">
          @if (loading()) {
            <div class="loading-row">
              <span class="material-icons spin">progress_activity</span>
              <span>Carregando…</span>
            </div>
          } @else if (alunos().length === 0) {
            <app-empty-state
              icon="group_off"
              title="Nenhum aluno cadastrado"
              description="Quando alunos se cadastrarem, eles aparecerão aqui."
            ></app-empty-state>
          } @else {
            <div class="table-wrap">
              <table class="table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>CPF</th>
                    <th>Curso</th>
                    <th>Instituição</th>
                    <th class="num">Saldo</th>
                    <th class="end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let a of alunos()">
                    <td class="strong">{{ a.nome }}</td>
                    <td>{{ a.email }}</td>
                    <td><code>{{ a.cpf }}</code></td>
                    <td><span class="badge">{{ a.curso }}</span></td>
                    <td>{{ a.instituicaoNome }}</td>
                    <td class="num accent">M$ {{ a.saldoMoedas }}</td>
                    <td class="end actions">
                      <button class="icon-btn" (click)="editar(a.id)" title="Editar">
                        <span class="material-icons">edit</span>
                      </button>
                      <button class="icon-btn icon-btn--danger" (click)="excluir(a)" title="Excluir">
                        <span class="material-icons">delete</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          }
        </app-card>
      </div>
    </app-shell>
  `,
  styles: [`
    .loading-row { display: flex; align-items: center; justify-content: center; gap: var(--space-2); padding: var(--space-7); color: var(--color-text-muted); }
    .spin { animation: spin 1s linear infinite; font-size: 20px !important; color: var(--color-brand); }
    @keyframes spin { to { transform: rotate(360deg); } }

    .table-wrap { overflow-x: auto; }
    .table {
      width: 100%; border-collapse: collapse; font-size: var(--text-sm);
    }
    .table th, .table td {
      padding: var(--space-3) var(--space-5);
      text-align: left;
      border-bottom: 1px solid var(--color-border);
    }
    .table th {
      font-size: var(--text-xs);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-text-muted);
      font-weight: 600;
      background: var(--color-surface-alt);
    }
    .table tbody tr:hover { background: var(--color-surface-alt); }
    .table tbody tr:last-child td { border-bottom: none; }
    .strong { font-weight: 600; color: var(--color-text); }
    .num { text-align: right; font-variant-numeric: tabular-nums; }
    .end { text-align: right; }
    .accent { color: var(--color-brand); font-weight: 700; }
    code { font-family: ui-monospace, monospace; background: var(--color-surface-alt); padding: 2px 6px; border-radius: var(--radius-sm); font-size: var(--text-xs); }
    .badge {
      display: inline-block;
      padding: 2px var(--space-2);
      background: var(--color-brand-soft);
      color: var(--color-brand);
      border-radius: var(--radius-full);
      font-size: var(--text-xs);
      font-weight: 600;
    }
    .actions { white-space: nowrap; }
    .icon-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 34px; height: 34px;
      border-radius: var(--radius-md);
      background: transparent;
      color: var(--color-text-muted);
      cursor: pointer;
      transition: all .15s;
    }
    .icon-btn:hover { background: var(--color-brand-soft); color: var(--color-brand); }
    .icon-btn--danger:hover { background: var(--color-danger-soft); color: var(--color-danger); }
    .icon-btn .material-icons { font-size: 18px; }
  `]
})
export class AlunoListComponent implements OnInit {
  private alunoService = inject(AlunoService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  protected alunos = signal<AlunoResponse[]>([]);
  protected loading = signal(true);

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.loading.set(true);
    this.alunoService.listar().subscribe({
      next: (res) => { this.alunos.set(res); this.loading.set(false); },
      error: () => { this.loading.set(false); this.snack.open('Erro ao carregar alunos.', 'Fechar', { duration: 4000, panelClass: ['snackbar-error'] }); },
    });
  }

  editar(id: number): void { this.router.navigate(['/alunos', id, 'editar']); }

  excluir(a: AlunoResponse): void {
    if (!confirm(`Excluir aluno "${a.nome}"?`)) return;
    this.alunoService.deletar(a.id).subscribe({
      next: () => { this.snack.open('Aluno excluído.', 'Fechar', { duration: 3000, panelClass: ['snackbar-success'] }); this.carregar(); },
      error: (err) => this.snack.open(err?.error?.mensagem ?? 'Erro ao excluir.', 'Fechar', { duration: 4000, panelClass: ['snackbar-error'] }),
    });
  }
}
