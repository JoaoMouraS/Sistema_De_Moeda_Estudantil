import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-form-field',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ff" [class.ff--error]="hasError">
      <label *ngIf="label" class="ff__label">
        {{ label }}
        <span *ngIf="required" class="ff__required" aria-hidden="true">*</span>
      </label>
      <div class="ff__control">
        <ng-content></ng-content>
      </div>
      <p *ngIf="hint && !hasError" class="ff__hint">{{ hint }}</p>
      <p *ngIf="hasError && error" class="ff__error" role="alert">{{ error }}</p>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .ff { display: flex; flex-direction: column; gap: var(--space-2); }
    .ff__label {
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--color-text);
    }
    .ff__required { color: var(--color-danger); margin-left: 2px; }
    .ff__control { display: block; }
    .ff__hint { font-size: var(--text-xs); color: var(--color-text-muted); }
    .ff__error { font-size: var(--text-xs); color: var(--color-danger); }

    // Estilo dos inputs nativos via ng-content
    .ff__control ::ng-deep input:not([type="checkbox"]):not([type="radio"]),
    .ff__control ::ng-deep select,
    .ff__control ::ng-deep textarea {
      width: 100%;
      font-family: var(--font-sans);
      font-size: var(--text-base);
      color: var(--color-text);
      background: var(--color-surface);
      border: 1px solid var(--color-border-strong);
      border-radius: var(--radius-md);
      padding: var(--space-3) var(--space-4);
      transition: border-color .15s ease, box-shadow .15s ease;
      min-height: 42px;
    }
    .ff__control ::ng-deep textarea {
      min-height: 96px;
      resize: vertical;
      line-height: var(--leading-normal);
    }
    .ff__control ::ng-deep input:focus,
    .ff__control ::ng-deep select:focus,
    .ff__control ::ng-deep textarea:focus {
      outline: none;
      border-color: var(--color-brand);
      box-shadow: 0 0 0 3px rgba(15, 76, 129, 0.15);
    }
    .ff__control ::ng-deep input::placeholder,
    .ff__control ::ng-deep textarea::placeholder {
      color: var(--color-text-muted);
    }
    .ff__control ::ng-deep input:disabled,
    .ff__control ::ng-deep select:disabled,
    .ff__control ::ng-deep textarea:disabled {
      background: var(--color-surface-alt);
      cursor: not-allowed;
    }

    .ff--error .ff__control ::ng-deep input,
    .ff--error .ff__control ::ng-deep select,
    .ff--error .ff__control ::ng-deep textarea {
      border-color: var(--color-danger);
    }
    .ff--error .ff__control ::ng-deep input:focus,
    .ff--error .ff__control ::ng-deep select:focus,
    .ff--error .ff__control ::ng-deep textarea:focus {
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15);
    }
  `]
})
export class FormFieldComponent {
  @Input() label?: string;
  @Input() hint?: string;
  @Input() error?: string;
  @Input() required = false;
  @Input() hasError = false;
}
