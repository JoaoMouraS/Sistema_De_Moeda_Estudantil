import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-empty-state',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="empty">
      <span class="material-icons-outlined empty__icon" aria-hidden="true">{{ icon }}</span>
      <h3 class="empty__title">{{ title }}</h3>
      <p *ngIf="description" class="empty__description">{{ description }}</p>
      <div class="empty__actions"><ng-content></ng-content></div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: var(--space-9) var(--space-5);
      color: var(--color-text-muted);
    }
    .empty__icon {
      font-size: 56px !important;
      color: var(--color-border-strong);
      margin-bottom: var(--space-4);
    }
    .empty__title {
      font-size: var(--text-lg);
      font-weight: 600;
      color: var(--color-text);
      margin-bottom: var(--space-2);
    }
    .empty__description { max-width: 420px; }
    .empty__actions { margin-top: var(--space-5); display: flex; gap: var(--space-3); }
  `]
})
export class EmptyStateComponent {
  @Input() icon = 'inbox';
  @Input({ required: true }) title!: string;
  @Input() description?: string;
}
