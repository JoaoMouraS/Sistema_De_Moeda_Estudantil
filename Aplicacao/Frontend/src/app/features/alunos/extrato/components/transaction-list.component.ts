import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Transaction } from '../../../../core/models/api-models';
import { TransactionItemComponent } from './transaction-item.component';

@Component({
  standalone: true,
  selector: 'app-transaction-list',
  imports: [CommonModule, MatIconModule, TransactionItemComponent],
  template: `
    <section class="transaction-list" aria-live="polite">
      <div *ngIf="loading; else content" class="skeleton-container" aria-busy="true">
        <div *ngFor="let item of skeletonRows" class="skeleton-item">
          <div class="skeleton-icon"></div>
          <div class="skeleton-details">
            <div class="skeleton-line title"></div>
            <div class="skeleton-line date"></div>
          </div>
          <div class="skeleton-amount"></div>
        </div>
      </div>

      <ng-template #content>
        <div *ngIf="transactions.length === 0; else items" class="empty-state">
          <mat-icon role="img" aria-hidden="true">receipt_long</mat-icon>
          <p>Nenhuma transação encontrada para este filtro.</p>
        </div>

        <ng-template #items>
          <div class="transaction-items" role="list" aria-label="Lista de transações">
            <app-transaction-item *ngFor="let tx of transactions" [transaction]="tx"></app-transaction-item>
          </div>
        </ng-template>
      </ng-template>
    </section>
  `,
  styles: [`
    .transaction-list {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      overflow: hidden;
    }
    .transaction-item {
      display: flex;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid #f0f0f0;
      transition: background-color 0.2s;
    }
    .transaction-item:hover {
      background-color: #f9fbfd;
    }
    .transaction-item:last-child {
      border-bottom: none;
    }
    .tx-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      margin-right: 16px;
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
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .tx-desc {
      font-weight: 500;
      color: #333;
      font-size: 1rem;
    }
    .tx-date {
      color: #777;
      font-size: 0.85rem;
      margin-top: 4px;
    }
    .tx-amount {
      font-weight: 600;
      font-size: 1.1rem;
    }
    .tx-amount.credito {
      color: #1e8e3e;
    }
    .tx-amount.debito {
      color: #d93025;
    }

    /* Skeleton Loading */
    .skeleton-item {
      display: flex;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid #f0f0f0;
    }
    .skeleton-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #e0e0e0;
      animation: pulse 1.5s infinite ease-in-out;
      margin-right: 16px;
    }
    .skeleton-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .skeleton-line {
      height: 16px;
      background: #e0e0e0;
      border-radius: 4px;
      animation: pulse 1.5s infinite ease-in-out;
    }
    .skeleton-line.title { width: 40%; }
    .skeleton-line.date { width: 20%; height: 12px; }
    .skeleton-amount {
      width: 60px;
      height: 20px;
      background: #e0e0e0;
      border-radius: 4px;
      animation: pulse 1.5s infinite ease-in-out;
    }
    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 1; }
      100% { opacity: 0.6; }
    }

    /* Empty State */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 24px;
      color: #888;
    }
    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
      margin-bottom: 16px;
    }
  `]
})
export class TransactionListComponent {
  @Input() transactions: Transaction[] = [];
  @Input() loading: boolean = false;

  skeletonRows = [1, 2, 3];
}