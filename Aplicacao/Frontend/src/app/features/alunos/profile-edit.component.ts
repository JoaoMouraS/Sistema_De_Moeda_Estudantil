import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { StudentProfile, UpdateProfileRequest } from '../../core/models/api-models';
import { AppShellComponent } from '../../shared/components/app-shell.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { CardComponent } from '../../shared/components/card.component';
import { ButtonComponent } from '../../shared/components/button.component';
import { FormFieldComponent } from '../../shared/components/form-field.component';

@Component({
  standalone: true,
  selector: 'app-profile-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppShellComponent,
    PageHeaderComponent,
    CardComponent,
    ButtonComponent,
    FormFieldComponent,
  ],
  template: `
    <app-shell>
      <div class="container-narrow">
        <app-page-header
          title="Meu perfil"
          subtitle="Atualize seus dados pessoais. Campos de identidade são apenas leitura."
          backTo="/alunos/painel"
        ></app-page-header>

        <ng-container *ngIf="loading(); else loaded">
          <app-card>
            <div class="loading-state">
              <span class="material-icons spin">progress_activity</span>
              <p>Carregando dados...</p>
            </div>
          </app-card>
        </ng-container>

        <ng-template #loaded>
          <div class="profile-grid">
            <app-card title="Dados pessoais">
              <form class="form" [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
                <app-form-field
                  label="Nome completo"
                  [required]="true"
                  [hasError]="invalid('nome')"
                  error="Nome obrigatório (mínimo 3 caracteres)"
                >
                  <input type="text" formControlName="nome">
                </app-form-field>

                <app-form-field
                  label="E-mail"
                  [required]="true"
                  [hasError]="invalid('email')"
                  error="E-mail inválido"
                >
                  <input type="email" formControlName="email" autocomplete="email">
                </app-form-field>

                <app-form-field label="Endereço" hint="Opcional">
                  <textarea formControlName="endereco" rows="2" placeholder="Rua, número, bairro, cidade/UF"></textarea>
                </app-form-field>

                <app-form-field
                  label="Nova senha"
                  hint="Deixe em branco para manter"
                  [hasError]="invalid('senha')"
                  error="Senha deve ter no mínimo 6 caracteres"
                >
                  <input type="password" formControlName="senha" autocomplete="new-password" placeholder="••••••••">
                </app-form-field>

                <div class="actions">
                  <app-button variant="secondary" type="button" (click)="cancel()">Cancelar</app-button>
                  <app-button variant="primary" type="submit" [loading]="saving()" [disabled]="form.invalid">
                    Salvar alterações
                  </app-button>
                </div>
              </form>
            </app-card>

            <app-card title="Informações de cadastro" subtitle="Estes campos são gerenciados pela instituição.">
              <dl class="readonly">
                <div><dt>CPF</dt><dd>{{ profile()?.cpf }}</dd></div>
                <div><dt>RG</dt><dd>{{ profile()?.rg }}</dd></div>
                <div><dt>Curso</dt><dd>{{ profile()?.curso }}</dd></div>
                <div><dt>Instituição</dt><dd>{{ profile()?.instituicaoNome }}</dd></div>
                <div><dt>Saldo de moedas</dt><dd class="strong">M$ {{ profile()?.saldoMoedas }}</dd></div>
              </dl>
            </app-card>
          </div>
        </ng-template>
      </div>
    </app-shell>
  `,
  styles: [`
    .form { display: flex; flex-direction: column; gap: var(--space-5); }
    .actions {
      display: flex; justify-content: flex-end; gap: var(--space-3);
      padding-top: var(--space-3);
      border-top: 1px solid var(--color-border);
    }
    .profile-grid { display: flex; flex-direction: column; gap: var(--space-5); }

    .loading-state {
      display: flex; flex-direction: column; align-items: center; gap: var(--space-3);
      padding: var(--space-7) 0;
      color: var(--color-text-muted);
    }
    .spin { animation: spin 1s linear infinite; font-size: 32px !important; color: var(--color-brand); }
    @keyframes spin { to { transform: rotate(360deg); } }

    .readonly { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4) var(--space-5); }
    .readonly dt {
      font-size: var(--text-xs);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: var(--space-1);
    }
    .readonly dd { font-size: var(--text-base); color: var(--color-text); font-weight: 500; }
    .readonly .strong { color: var(--color-brand); font-weight: 700; }
    @media (max-width: 560px) { .readonly { grid-template-columns: 1fr; } }
  `]
})
export class ProfileEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  protected loading = signal(true);
  protected saving = signal(false);
  protected profile = signal<StudentProfile | null>(null);

  protected invalid = (field: string) => {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl.touched);
  };

  protected form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    endereco: [''],
    senha: ['', [Validators.minLength(6)]],
  });

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.profileService.getStudentProfile(user.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (p) => {
          this.profile.set(p);
          this.form.patchValue({ nome: p.nome, email: p.email, endereco: p.endereco ?? '' });
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          this.handleError(err, 'Erro ao carregar perfil.');
        },
      });
  }

  cancel(): void {
    this.router.navigate(['/alunos/painel']);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.saving.set(true);
    const v = this.form.getRawValue();
    const payload: UpdateProfileRequest = {
      nome: v.nome,
      email: v.email,
      endereco: v.endereco?.trim() || undefined,
      senha: v.senha?.trim() || undefined,
    };

    this.profileService.updateStudentProfile(user.id, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.saving.set(false);
          this.authService.updateCurrentUserName(updated.nome);
          this.profile.set(updated);
          this.snack.open('Perfil atualizado.', 'Fechar', { duration: 3000, panelClass: ['snackbar-success'] });
          this.router.navigate(['/alunos/painel']);
        },
        error: (err) => {
          this.saving.set(false);
          this.handleError(err, 'Erro ao atualizar perfil.');
        },
      });
  }

  private handleError(err: any, fallback: string): void {
    if (err?.status === 401 || err?.status === 403) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return;
    }
    const msg = err?.error?.mensagem || err?.error?.message || fallback;
    this.snack.open(msg, 'Fechar', { duration: 4000, panelClass: ['snackbar-error'] });
  }
}
