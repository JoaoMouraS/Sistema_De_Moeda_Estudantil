import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { StudentProfile, TransacaoResponse } from '../../../core/models/api-models';
import { AppShellComponent } from '../../../shared/components/app-shell.component';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';
import { CardComponent } from '../../../shared/components/card.component';
import { FormFieldComponent } from '../../../shared/components/form-field.component';
import { TransactionListComponent } from '../../../shared/components/transaction-list.component';
import { TransactionView } from '../../../shared/components/transaction-item.component';

type PeriodFilter = '7' | '30' | 'all';
type DirectionFilter = 'all' | 'in' | 'out';

@Component({
  standalone: true,
  selector: 'app-aluno-extrato',
  imports: [
    CommonModule,
    FormsModule,
    AppShellComponent,
    PageHeaderComponent,
    CardComponent,
    FormFieldComponent,
    TransactionListComponent,
  ],
  template: `
    <app-shell>
      <div class="container">
        <app-page-header
          title="Extrato de moedas"
          subtitle="Acompanhe seu saldo e o histórico de movimentações."
          backTo="/alunos/painel"
        ></app-page-header>

        <section class="balance">
          <div class="balance__label">Saldo atual</div>
          <div class="balance__value">
            <span class="balance__unit">M$</span>
            {{ profile()?.saldoMoedas ?? 0 }}
          </div>
          <div class="balance__hint">Mantenha-se atento às novas movimentações</div>
        </section>

        <app-card title="Filtros" subtitle="Refine o histórico por período ou tipo de movimentação">
          <div class="filters">
            <app-form-field label="Período">
              <div class="select-wrap">
                <select [ngModel]="period()" (ngModelChange)="period.set($event)">
                  <option *ngFor="let p of periods" [value]="p.value">{{ p.label }}</option>
                </select>
                <span class="material-icons select-wrap__icon" aria-hidden="true">expand_more</span>
              </div>
            </app-form-field>

            <app-form-field label="Tipo">
              <div class="select-wrap">
                <select [ngModel]="direction()" (ngModelChange)="direction.set($event)">
                  <option *ngFor="let d of directions" [value]="d.value">{{ d.label }}</option>
                </select>
                <span class="material-icons select-wrap__icon" aria-hidden="true">expand_more</span>
              </div>
            </app-form-field>
          </div>
        </app-card>

        <section class="history">
          <h2 class="history__title">Histórico</h2>
          <app-transaction-list
            [loading]="loading()"
            [transactions]="filtered()"
            emptyTitle="Sem movimentações neste período"
            emptyDescription="Tente um filtro diferente ou aguarde novas transações."
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
    .balance__label {
      font-size: var(--text-sm);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      opacity: .8;
    }
    .balance__value {
      font-size: clamp(2.5rem, 5vw, 3.5rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      margin-top: var(--space-2);
      display: flex; align-items: baseline; gap: var(--space-2);
      font-variant-numeric: tabular-nums;
    }
    .balance__unit { font-size: var(--text-xl); font-weight: 600; opacity: .75; }
    .balance__hint { margin-top: var(--space-2); opacity: .7; font-size: var(--text-sm); }

    .filters {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4) var(--space-5);
    }
    @media (max-width: 560px) { .filters { grid-template-columns: 1fr; } }

    .select-wrap { position: relative; }
    .select-wrap select {
      appearance: none;
      -webkit-appearance: none;
      padding-right: 40px;
      cursor: pointer;
    }
    .select-wrap__icon {
      position: absolute;
      right: var(--space-3);
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-text-muted);
      pointer-events: none;
      font-size: 22px !important;
    }

    .history { margin-top: var(--space-6); }
    .history__title {
      font-size: var(--text-lg);
      font-weight: 600;
      margin-bottom: var(--space-3);
    }
  `]
})
export class AlunoExtratoComponent implements OnInit {
  private profileService = inject(ProfileService);
  private auth = inject(AuthService);
  private router = inject(Router);

  protected profile = signal<StudentProfile | null>(null);
  protected transactions = signal<TransacaoResponse[]>([]);
  protected loading = signal(true);

  protected period = signal<PeriodFilter>('all');
  protected direction = signal<DirectionFilter>('all');

  protected periods = [
    { label: 'Últimos 7 dias', value: '7' as PeriodFilter },
    { label: 'Últimos 30 dias', value: '30' as PeriodFilter },
    { label: 'Tudo', value: 'all' as PeriodFilter },
  ];
  protected directions = [
    { label: 'Todas', value: 'all' as DirectionFilter },
    { label: 'Recebimentos', value: 'in' as DirectionFilter },
    { label: 'Resgates', value: 'out' as DirectionFilter },
  ];

  protected filtered = computed<TransactionView[]>(() => {
    const all = this.transactions();
    const cutoff = this.period() === 'all'
      ? null
      : new Date(Date.now() - parseInt(this.period(), 10) * 24 * 60 * 60 * 1000);

    return all
      .map<TransactionView>((t) => ({
        id: t.id,
        dataHora: t.dataHora,
        descricao: t.descricao,
        direction: t.tipo === 'ENVIO_MOEDA' ? 'in' : 'out',
        valor: t.valor,
        contraparte: null,
      }))
      .filter((t) => {
        if (this.direction() !== 'all' && t.direction !== this.direction()) return false;
        if (cutoff && new Date(t.dataHora) < cutoff) return false;
        return true;
      });
  });

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.profileService.getStudentProfile(user.id).subscribe({
      next: (p) => this.profile.set(p),
    });
    this.profileService.getStudentTransactions(user.id).subscribe({
      next: (list) => {
        this.transactions.set(list);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
