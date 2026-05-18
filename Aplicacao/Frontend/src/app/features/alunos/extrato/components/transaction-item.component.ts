import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Transaction } from '../../../../core/models/api-models';

@Component({
  standalone: true,
  selector: 'app-transaction-item',
  imports: [CommonModule, MatIconModule],
  template: `
    <article class="transaction-item" role="listitem">
      <div class="tx-icon" [class.credito]="transaction.tipo === 'CREDITO'" [class.debito]="transaction.tipo === 'DEBITO'" aria-hidden="true">
        <mat-icon>{{ transaction.tipo === 'CREDITO' ? 'arrow_upward' : 'arrow_downward' }}</mat-icon>
      </div>

      <div class="tx-details">
        <strong class="tx-desc">{{ transaction.descricao }}</strong>
        <time class="tx-date" [attr.datetime]="formatDateTime(transaction.dataHora)">
          {{ transaction.dataHora | date:'dd/MM/yyyy HH:mm' }}
        </time>
      </div>

      <div class="tx-amount" [class.credito]="transaction.tipo === 'CREDITO'" [class.debito]="transaction.tipo === 'DEBITO'" aria-label="Valor da transação">
        {{ transaction.tipo === 'CREDITO' ? '+' : '-' }} {{ transaction.valor | number:'1.0-0' }} M$
      </div>
    </article>
  `,
  styles: [`
    .transaction-item {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 16px;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid #f0f0f0;
      background: white;
    }
    .transaction-item:last-child {
      border-bottom: none;
    }
    .tx-icon {
      width: 48px;
      height: 48px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 1.25rem;
    }
    .tx-icon.credito {
      background: #e6f4ea;
      color: #1e8e3e;
    }
    .tx-icon.debito {
      background: #fce8e6;
      color: #d93025;
    }
    .tx-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .tx-desc {
      font-size: 1rem;
      color: #222;
      margin: 0;
    }
    .tx-date {
      color: #666;
      font-size: 0.85rem;
    }
    .tx-amount {
      font-weight: 700;
      font-size: 1.05rem;
      text-align: right;
      min-width: 120px;
    }
    .tx-amount.credito {
      color: #1e8e3e;
    }
    .tx-amount.debito {
      color: #d93025;
    }
    @media (max-width: 640px) {
      .transaction-item {
        grid-template-columns: auto 1fr;
        grid-template-rows: auto auto;
      }
      .tx-amount {
        text-align: left;
      }
    }
  `]
})
export class TransactionItemComponent {
  @Input() transaction!: Transaction;

  formatDateTime(value: string | Date): string {
    const date = value instanceof Date ? value : new Date(value);
    return date.toISOString();
  }
}
