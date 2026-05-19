import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionItemComponent, TransactionView } from './transaction-item.component';
import { EmptyStateComponent } from './empty-state.component';

@Component({
  standalone: true,
  selector: 'app-transaction-list',
  imports: [CommonModule, TransactionItemComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="tx-list" aria-live="polite">
      <ng-container *ngIf="loading; else loaded">
        <div class="skeleton" *ngFor="let _ of [1,2,3]">
          <div class="sk-circle"></div>
          <div class="sk-lines">
            <div class="sk-line w-50"></div>
            <div class="sk-line w-25"></div>
          </div>
          <div class="sk-amount"></div>
        </div>
      </ng-container>
      <ng-template #loaded>
        <ng-container *ngIf="transactions.length; else empty">
          <div role="list">
            <app-transaction-item *ngFor="let tx of transactions" [transaction]="tx"></app-transaction-item>
          </div>
        </ng-container>
        <ng-template #empty>
          <app-empty-state icon="receipt_long" [title]="emptyTitle" [description]="emptyDescription"></app-empty-state>
        </ng-template>
      </ng-template>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .tx-list {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }

    .skeleton {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: var(--space-4);
      align-items: center;
      padding: var(--space-4) var(--space-5);
      border-bottom: 1px solid var(--color-border);
    }
    .skeleton:last-child { border-bottom: none; }
    .sk-circle { width: 40px; height: 40px; border-radius: 50%; background: var(--color-surface-alt); animation: pulse 1.4s infinite ease-in-out; }
    .sk-lines { display: flex; flex-direction: column; gap: 6px; }
    .sk-line { height: 14px; background: var(--color-surface-alt); border-radius: 4px; animation: pulse 1.4s infinite ease-in-out; }
    .w-50 { width: 50%; }
    .w-25 { width: 25%; height: 10px; }
    .sk-amount { width: 70px; height: 18px; background: var(--color-surface-alt); border-radius: 4px; animation: pulse 1.4s infinite ease-in-out; }
    @keyframes pulse { 0%, 100% { opacity: .5; } 50% { opacity: 1; } }
  `]
})
export class TransactionListComponent {
  @Input() transactions: TransactionView[] = [];
  @Input() loading = false;
  @Input() emptyTitle = 'Nenhuma transação encontrada';
  @Input() emptyDescription = 'Quando houver movimentações de moedas, elas aparecerão aqui.';
}
