import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresaService } from '../../core/services/empresa.service';
import { AuthService } from '../../core/services/auth.service';
import { TransacaoResponse } from '../../core/models/api-models';
import { AppShellComponent } from '../../shared/components/app-shell.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { CardComponent } from '../../shared/components/card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';

@Component({
  standalone: true,
  selector: 'app-empresa-relatorio',
  imports: [CommonModule, AppShellComponent, PageHeaderComponent, CardComponent, EmptyStateComponent],
  template: `
    <app-shell>
      <div class="container">
        <app-page-header
          title="Relatório de trocas"
          subtitle="Histórico de alunos que resgataram vantagens da sua empresa."
        ></app-page-header>

        <div class="grid-3 metrics">
          <app-card>
            <div class="metric">
              <span class="material-icons-outlined metric__icon">receipt_long</span>
              <div>
                <div class="metric__label">Total de trocas</div>
                <div class="metric__value">{{ trocas().length }}</div>
              </div>
            </div>
          </app-card>
          <app-card>
            <div class="metric">
              <span class="material-icons-outlined metric__icon">monetization_on</span>
              <div>
                <div class="metric__label">Moedas resgatadas</div>
                <div class="metric__value">{{ totalMoedas() }}</div>
              </div>
            </div>
          </app-card>
          <app-card>
            <div class="metric">
              <span class="material-icons-outlined metric__icon">person</span>
              <div>
                <div class="metric__label">Alunos atendidos</div>
                <div class="metric__value">{{ alunosUnicos() }}</div>
              </div>
            </div>
          </app-card>
        </div>

        <app-card title="Histórico" [padded]="false">
          @if (loading()) {
            <div class="loading-row">
              <span class="material-icons spin">progress_activity</span>
              <span>Carregando…</span>
            </div>
          } @else if (trocas().length === 0) {
            <app-empty-state
              icon="receipt_long"
              title="Nenhuma troca registrada"
              description="Quando um aluno resgatar uma vantagem da sua empresa, o registro aparecerá aqui."
            ></app-empty-state>
          } @else {
            <div class="table-wrap">
              <table class="table">
                <thead>
                  <tr>
                    <th>Data/Hora</th>
                    <th>Aluno</th>
                    <th>Descrição</th>
                    <th class="num">Moedas</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let t of trocas()">
                    <td>{{ t.dataHora | date:'dd/MM/yyyy HH:mm' }}</td>
                    <td>{{ t.alunoNome ?? ('#' + (t.alunoId ?? '-')) }}</td>
                    <td>{{ t.descricao }}</td>
                    <td class="num accent">{{ t.valor }}</td>
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
    .metrics { margin-bottom: var(--space-6); }
    .metric { display: flex; align-items: center; gap: var(--space-4); }
    .metric__icon {
      width: 48px; height: 48px;
      border-radius: var(--radius-md);
      background: var(--color-brand-soft);
      color: var(--color-brand);
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 24px !important;
    }
    .metric__label { font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted); }
    .metric__value { font-size: var(--text-2xl); font-weight: 700; margin-top: 2px; font-variant-numeric: tabular-nums; }

    .loading-row { display: flex; align-items: center; justify-content: center; gap: var(--space-2); padding: var(--space-7); color: var(--color-text-muted); }
    .spin { animation: spin 1s linear infinite; font-size: 20px !important; color: var(--color-brand); }
    @keyframes spin { to { transform: rotate(360deg); } }

    .table-wrap { overflow-x: auto; }
    .table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
    .table th, .table td { padding: var(--space-3) var(--space-5); text-align: left; border-bottom: 1px solid var(--color-border); }
    .table th { font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted); font-weight: 600; background: var(--color-surface-alt); }
    .table tbody tr:last-child td { border-bottom: none; }
    .num { text-align: right; font-variant-numeric: tabular-nums; }
    .accent { color: var(--color-brand); font-weight: 700; }
  `]
})
export class EmpresaRelatorioComponent implements OnInit {
  private empresaService = inject(EmpresaService);
  private auth = inject(AuthService);

  protected loading = signal(true);
  protected trocas = signal<TransacaoResponse[]>([]);

  protected totalMoedas = computed(() => this.trocas().reduce((sum, t) => sum + (t.valor || 0), 0));
  protected alunosUnicos = computed(() => new Set(this.trocas().map((t) => t.alunoId).filter(Boolean)).size);

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (!user || user.tipoUsuario !== 'EMPRESA') {
      this.loading.set(false);
      return;
    }
    this.empresaService.relatorioTrocas(user.id).subscribe({
      next: (list) => { this.trocas.set(list); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
