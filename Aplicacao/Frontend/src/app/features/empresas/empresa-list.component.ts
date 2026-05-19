import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmpresaService } from '../../core/services/empresa.service';
import { EmpresaResponse } from '../../core/models/api-models';
import { AppShellComponent } from '../../shared/components/app-shell.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { CardComponent } from '../../shared/components/card.component';
import { ButtonComponent } from '../../shared/components/button.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';

@Component({
  standalone: true,
  selector: 'app-empresa-list',
  imports: [CommonModule, RouterLink, AppShellComponent, PageHeaderComponent, CardComponent, ButtonComponent, EmptyStateComponent],
  template: `
    <app-shell>
      <div class="container">
        <app-page-header
          title="Empresas parceiras"
          subtitle="Gerencie os parceiros que oferecem vantagens."
        >
          <app-button variant="primary" routerLink="/empresas/novo">
            <span class="material-icons">add</span>
            Nova empresa
          </app-button>
        </app-page-header>

        <app-card [padded]="false">
          @if (loading()) {
            <div class="loading-row">
              <span class="material-icons spin">progress_activity</span>
              <span>Carregando…</span>
            </div>
          } @else if (empresas().length === 0) {
            <app-empty-state
              icon="storefront"
              title="Nenhuma empresa cadastrada"
              description="Quando empresas se cadastrarem, elas aparecerão aqui."
            ></app-empty-state>
          } @else {
            <div class="table-wrap">
              <table class="table">
                <thead>
                  <tr>
                    <th>Nome fantasia</th>
                    <th>CNPJ</th>
                    <th>E-mail</th>
                    <th>Descrição</th>
                    <th class="end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let e of empresas()">
                    <td class="strong">{{ e.nomeFantasia }}</td>
                    <td><code>{{ e.cnpj }}</code></td>
                    <td>{{ e.email }}</td>
                    <td class="truncate">{{ e.descricao || '—' }}</td>
                    <td class="end actions">
                      <button class="icon-btn" (click)="editar(e.id)" title="Editar">
                        <span class="material-icons">edit</span>
                      </button>
                      <button class="icon-btn icon-btn--danger" (click)="excluir(e)" title="Excluir">
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
    .table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
    .table th, .table td { padding: var(--space-3) var(--space-5); text-align: left; border-bottom: 1px solid var(--color-border); }
    .table th { font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted); font-weight: 600; background: var(--color-surface-alt); }
    .table tbody tr:hover { background: var(--color-surface-alt); }
    .table tbody tr:last-child td { border-bottom: none; }
    .strong { font-weight: 600; color: var(--color-text); }
    .end { text-align: right; }
    .truncate { max-width: 280px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--color-text-muted); }
    code { font-family: ui-monospace, monospace; background: var(--color-surface-alt); padding: 2px 6px; border-radius: var(--radius-sm); font-size: var(--text-xs); }
    .actions { white-space: nowrap; }
    .icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: var(--radius-md); background: transparent; color: var(--color-text-muted); cursor: pointer; transition: all .15s; }
    .icon-btn:hover { background: var(--color-brand-soft); color: var(--color-brand); }
    .icon-btn--danger:hover { background: var(--color-danger-soft); color: var(--color-danger); }
    .icon-btn .material-icons { font-size: 18px; }
  `]
})
export class EmpresaListComponent implements OnInit {
  private empresaService = inject(EmpresaService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  protected empresas = signal<EmpresaResponse[]>([]);
  protected loading = signal(true);

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.loading.set(true);
    this.empresaService.listar().subscribe({
      next: (res) => { this.empresas.set(res); this.loading.set(false); },
      error: () => { this.loading.set(false); this.snack.open('Erro ao carregar empresas.', 'Fechar', { duration: 4000, panelClass: ['snackbar-error'] }); },
    });
  }

  editar(id: number): void { this.router.navigate(['/empresas', id, 'editar']); }

  excluir(e: EmpresaResponse): void {
    if (!confirm(`Excluir empresa "${e.nomeFantasia}"?`)) return;
    this.empresaService.deletar(e.id).subscribe({
      next: () => { this.snack.open('Empresa excluída.', 'Fechar', { duration: 3000, panelClass: ['snackbar-success'] }); this.carregar(); },
      error: (err) => this.snack.open(err?.error?.mensagem ?? 'Erro ao excluir.', 'Fechar', { duration: 4000, panelClass: ['snackbar-error'] }),
    });
  }
}
