import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TransactionView {
  id: number;
  dataHora: string | Date;
  descricao: string;
  direction: 'in' | 'out';
  valor: number;
  contraparte?: string | null;
}

@Component({
  standalone: true,
  selector: 'app-transaction-item',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="tx" role="listitem">
      <div class="tx__icon" [class.tx__icon--in]="transaction.direction === 'in'" [class.tx__icon--out]="transaction.direction === 'out'" aria-hidden="true">
        <span class="material-icons">{{ transaction.direction === 'in' ? 'arrow_downward' : 'arrow_upward' }}</span>
      </div>
      <div class="tx__details">
        <strong class="tx__desc">{{ transaction.descricao }}</strong>
        <span class="tx__meta">
          <time [attr.datetime]="iso(transaction.dataHora)">{{ transaction.dataHora | date:'dd/MM/yyyy HH:mm' }}</time>
          <span *ngIf="transaction.contraparte"> · {{ transaction.contraparte }}</span>
        </span>
      </div>
      <div class="tx__amount" [class.tx__amount--in]="transaction.direction === 'in'" [class.tx__amount--out]="transaction.direction === 'out'">
        {{ transaction.direction === 'in' ? '+' : '−' }}{{ transaction.valor | number:'1.0-0' }} <span class="tx__unit">M$</span>
      </div>
    </article>
  `,
  styles: [`
    :host { display: block; }
    .tx {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: var(--space-4);
      align-items: center;
      padding: var(--space-4) var(--space-5);
      border-bottom: 1px solid var(--color-border);
      background: var(--color-surface);
      transition: background .15s;
    }
    .tx:hover { background: var(--color-surface-alt); }
    .tx:last-child { border-bottom: none; }

    .tx__icon {
      width: 40px; height: 40px;
      border-radius: 50%;
      display: inline-flex; align-items: center; justify-content: center;
    }
    .tx__icon .material-icons { font-size: 20px; }
    .tx__icon--in { background: var(--color-success-soft); color: var(--color-success); }
    .tx__icon--out { background: var(--color-danger-soft); color: var(--color-danger); }

    .tx__details { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .tx__desc {
      font-size: var(--text-base);
      color: var(--color-text);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .tx__meta { font-size: var(--text-xs); color: var(--color-text-muted); }

    .tx__amount {
      font-weight: 700;
      font-size: var(--text-base);
      text-align: right;
      min-width: 100px;
      font-variant-numeric: tabular-nums;
    }
    .tx__amount--in { color: var(--color-success); }
    .tx__amount--out { color: var(--color-danger); }
    .tx__unit { font-size: var(--text-xs); font-weight: 500; opacity: .8; }

    @media (max-width: 560px) {
      .tx { grid-template-columns: auto 1fr; }
      .tx__amount { grid-column: 2; text-align: left; min-width: 0; }
    }
  `]
})
export class TransactionItemComponent {
  @Input({ required: true }) transaction!: TransactionView;
  protected iso(v: string | Date): string {
    return (v instanceof Date ? v : new Date(v)).toISOString();
  }
}
