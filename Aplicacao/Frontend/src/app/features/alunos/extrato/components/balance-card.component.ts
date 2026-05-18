import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-balance-card',
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="balance-card">
      <mat-card-content>
        <div class="balance-header">
          <mat-icon class="coin-icon">monetization_on</mat-icon>
          <h2>Saldo Atual</h2>
        </div>
        <div class="balance-amount">
          <span class="currency">M$</span>
          <span class="amount">{{ saldo | number:'1.0-0' }}</span>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .balance-card {
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      color: white;
      border-radius: 12px;
      margin-bottom: 24px;
      padding: 16px;
    }
    .balance-header {
      display: flex;
      align-items: center;
      gap: 8px;
      opacity: 0.9;
    }
    .balance-header h2 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 500;
    }
    .coin-icon {
      color: #ffd700;
    }
    .balance-amount {
      margin-top: 16px;
      font-size: 3rem;
      font-weight: 700;
      display: flex;
      align-items: baseline;
      gap: 8px;
    }
    .currency {
      font-size: 1.5rem;
      opacity: 0.8;
    }
  `]
})
export class BalanceCardComponent {
  @Input() saldo: number = 0;
}