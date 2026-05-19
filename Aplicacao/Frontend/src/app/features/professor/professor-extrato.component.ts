import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ProfessorService } from '../../core/services/professor.service';
import { ExtratoResponse } from '../../core/models/api-models';
import { AppShellComponent } from '../../shared/components/app-shell.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { TransactionListComponent } from '../../shared/components/transaction-list.component';
import { TransactionView } from '../../shared/components/transaction-item.component';

@Component({
  standalone: true,
  selector: 'app-professor-extrato',
  imports: [CommonModule, AppShellComponent, PageHeaderComponent, TransactionListComponent],
  template: `
    <app-shell>
      <div class="container">
        <app-page-header
          title="Meu extrato"
          subtitle="Histórico de moedas distribuídas a alunos."
          backTo="/professor/painel"
        ></app-page-header>

        <section class="balance" *ngIf="extrato() as e">
          <div class="balance__label">Saldo restante</div>
          <div class="balance__value"><span class="balance__unit">M$</span>{{ e.saldoAtual }}</div>
        </section>

        <section class="history">
          <h2 class="history__title">Reconhecimentos enviados</h2>
          <app-transaction-list
            [loading]="loading()"
            [transactions]="views()"
            emptyTitle="Nenhuma distribuição ainda"
            emptyDescription="Quando você enviar moedas a alunos, os reconhecimentos aparecerão aqui."
          ></app-transaction-list>
        </section>
      </div>
    </app-shell>
  `,
  styles: [`
    .balance {
      background: linear-gradient(135deg, var(--color-brand) 0%, #0a3358 100%);
      color: #fff;
      border-radius: var(--radius-lg);
      padding: var(--space-7);
      margin-bottom: var(--space-6);
      box-shadow: var(--shadow-md);
    }
    .balance__label { font-size: var(--text-sm); text-transform: uppercase; letter-spacing: 0.08em; opacity: .8; }
    .balance__value {
      font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 800; letter-spacing: -0.03em;
      display: flex; align-items: baseline; gap: var(--space-2); margin-top: var(--space-2);
      font-variant-numeric: tabular-nums;
    }
    .balance__unit { font-size: var(--text-xl); font-weight: 600; opacity: .75; }

    .history { margin-top: var(--space-6); }
    .history__title { font-size: var(--text-lg); font-weight: 600; margin-bottom: var(--space-3); }
  `]
})
export class ProfessorExtratoComponent implements OnInit {
  private auth = inject(AuthService);
  private professorService = inject(ProfessorService);

  protected extrato = signal<ExtratoResponse | null>(null);
  protected loading = signal(true);

  protected views = computed<TransactionView[]>(() =>
    (this.extrato()?.transacoes ?? []).map((t) => ({
      id: t.id,
      dataHora: t.dataHora,
      descricao: t.descricao,
      direction: 'out',
      valor: t.valor,
      contraparte: t.alunoNome ? `Para ${t.alunoNome}` : null,
    }))
  );

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (!user) return;
    this.professorService.getExtrato(user.id).subscribe({
      next: (e) => { this.extrato.set(e); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
