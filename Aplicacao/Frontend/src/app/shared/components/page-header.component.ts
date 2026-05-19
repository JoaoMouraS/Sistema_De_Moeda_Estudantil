import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-page-header',
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-header">
      <div class="page-header__main">
        <a *ngIf="backTo" [routerLink]="backTo" class="page-header__back">
          <span class="material-icons" aria-hidden="true">arrow_back</span>
          {{ backLabel }}
        </a>
        <h1 class="page-header__title">{{ title }}</h1>
        <p *ngIf="subtitle" class="page-header__subtitle">{{ subtitle }}</p>
      </div>
      <div class="page-header__actions">
        <ng-content></ng-content>
      </div>
    </header>
  `,
  styles: [`
    :host { display: block; }
    .page-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: var(--space-6);
      margin-bottom: var(--space-7);
      flex-wrap: wrap;
    }
    .page-header__main { min-width: 0; }
    .page-header__back {
      display: inline-flex;
      align-items: center;
      gap: var(--space-1);
      color: var(--color-text-muted);
      font-size: var(--text-sm);
      font-weight: 500;
      margin-bottom: var(--space-2);
      transition: color .15s;
    }
    .page-header__back:hover { color: var(--color-brand); }
    .page-header__back .material-icons { font-size: 18px; }

    .page-header__title {
      font-size: var(--text-3xl);
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .page-header__subtitle {
      margin-top: var(--space-2);
      font-size: var(--text-base);
      color: var(--color-text-muted);
    }
    .page-header__actions { display: flex; gap: var(--space-3); flex-shrink: 0; }
  `]
})
export class PageHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
  @Input() backTo?: string;
  @Input() backLabel = 'Voltar';
}
