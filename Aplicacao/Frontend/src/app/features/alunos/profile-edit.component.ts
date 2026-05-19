import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormControl, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProfileService, StudentProfile } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-profile-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="profile-container">
      <header class="profile-header">
        <a routerLink="/alunos/painel" class="back-link">
          <i class="bx bx-arrow-back"></i> Voltar
        </a>
        <h1>Editar Meu Perfil</h1>
        <p class="subtitle">Atualize seus dados pessoais e informações de contato</p>
      </header>

      <main class="profile-content">
        <div *ngIf="loading(); else formContent" class="loading-state">
          <mat-spinner diameter="48"></mat-spinner>
          <p>Carregando seus dados...</p>
        </div>

        <ng-template #formContent>
          <mat-card class="profile-card">
            <mat-card-header>
              <mat-card-title>Dados Pessoais</mat-card-title>
            </mat-card-header>

            <mat-card-content>
              <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Nome Completo</mat-label>
                    <input matInput formControlName="nome" type="text" placeholder="Seu nome completo" />
                    <mat-error *ngIf="profileForm.controls.nome.hasError('required')">
                      Nome é obrigatório
                    </mat-error>
                    <mat-error *ngIf="profileForm.controls.nome.hasError('minlength')">
                      Nome deve ter no mínimo 3 caracteres
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Email</mat-label>
                    <input matInput formControlName="email" type="email" placeholder="seu@email.com" />
                    <mat-error *ngIf="profileForm.controls.email.hasError('required')">
                      Email é obrigatório
                    </mat-error>
                    <mat-error *ngIf="profileForm.controls.email.hasError('email')">
                      Email inválido
                    </mat-error>
                  </mat-form-field>
                </div>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Endereço (Opcional)</mat-label>
                  <textarea matInput formControlName="endereco" rows="3"></textarea>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Nova Senha (Deixe em branco para não alterar)</mat-label>
                  <input matInput formControlName="senha" type="password" />
                  <mat-error *ngIf="profileForm.controls.senha.hasError('minlength')">
                    Senha deve ter no mínimo 8 caracteres
                  </mat-error>
                </mat-form-field>

                <fieldset class="readonly-section">
                  <legend>Informações de Registro</legend>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>CPF</mat-label>
                      <input matInput formControlName="cpf" />
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>RG</mat-label>
                      <input matInput formControlName="rg" />
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Curso</mat-label>
                      <input matInput formControlName="curso" />
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Instituição</mat-label>
                      <input matInput formControlName="instituicaoNome" />
                    </mat-form-field>
                  </div>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Saldo de Moedas</mat-label>
                    <input matInput formControlName="saldoMoedas" />
                  </mat-form-field>
                </fieldset>

                <div *ngIf="errorMessage()" class="error-message">
                  <mat-icon>error</mat-icon>
                  <span>{{ errorMessage() }}</span>
                </div>

                <div class="form-actions">
                  <button
                    mat-stroked-button
                    type="button"
                    routerLink="/alunos/painel"
                    [disabled]="saving()"
                  >
                    Cancelar
                  </button>
                  <button
                    mat-raised-button
                    color="primary"
                    type="submit"
                    [disabled]="profileForm.invalid || saving()"
                  >
                    <mat-spinner *ngIf="saving()" diameter="20" class="button-spinner"></mat-spinner>
                    {{ saving() ? 'Salvando...' : 'Salvar Alterações' }}
                  </button>
                </div>
              </form>
            </mat-card-content>
          </mat-card>
        </ng-template>
      </main>
    </div>
  `,
  // Seus estilos originais mantidos integralmente
  styles: [`
    @import url('https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css');

    :host {
      display: block;
      color: #111827;
    }

    :host ::ng-deep .mat-form-field-infix,
    :host ::ng-deep .mat-form-field-label,
    :host ::ng-deep .mat-input-element,
    :host ::ng-deep .mat-form-field-ripple {
      color: #111827;
    }

    .profile-container {
      min-height: 100vh;
      background-color: #f3f6fb;
      padding: 32px 20px;
      font-family: Inter, system-ui, -apple-system, 'Segoe UI', sans-serif;
      color: #111827;
    }
    .profile-header {
      max-width: 900px;
      margin: 0 auto 24px;
      display: grid;
      gap: 12px;
    }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #1f3a8a;
      text-decoration: none;
      font-weight: 700;
    }
    h1 {
      margin: 0;
      font-size: clamp(1.9rem, 2.2vw, 2.6rem);
      color: #111827;
      letter-spacing: -0.02em;
    }
    .subtitle {
      margin: 0;
      color: #4b5563;
      max-width: 720px;
      line-height: 1.7;
    }
    .profile-content {
      max-width: 920px;
      margin: 0 auto;
    }
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 0;
      color: #4b5563;
      gap: 16px;
    }
    .profile-card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 18px;
      box-shadow: 0 18px 60px rgba(15, 23, 42, 0.08);
    }
    .profile-card::part(header) {
      padding-bottom: 0;
    }
    .full-width {
      width: 100%;
      margin-bottom: 18px;
    }
    .readonly-section {
      border: 1px solid #d1d5db;
      border-radius: 14px;
      padding: 22px;
      margin: 24px 0;
      background-color: #f8fafc;
    }
    .readonly-section legend {
      font-weight: 700;
      color: #334155;
      padding: 0 8px;
      font-size: 0.9rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .error-message {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #b91c1c;
      background-color: #fef2f2;
      border: 1px solid #fecaca;
      padding: 14px 16px;
      border-radius: 12px;
      margin-bottom: 18px;
    }
    .form-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 26px;
    }
    .form-actions button {
      min-width: 160px;
    }
    .button-spinner {
      display: inline-flex;
      margin-right: 8px;
    }
    @media (min-width: 900px) {
      .form-row {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        column-gap: 18px;
      }
      .readonly-section {
        padding: 24px;
      }
    }
    @media (max-width: 900px) {
      .profile-container {
        padding: 24px 16px;
      }
      .profile-card {
        border-radius: 16px;
      }
      h1 {
        font-size: 1.8rem;
      }
    }
    @media (max-width: 680px) {
      .form-actions {
        flex-direction: column;
        align-items: stretch;
      }
      .form-actions button {
        width: 100%;
      }
    }
  `]
})
export class ProfileEditComponent implements OnInit {
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snack = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef); // 💡 Injetado para gerenciar vazamento de memória

  saving = signal(false);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  // 💡 Formulário fortemente tipado
  profileForm = this.fb.group({
    nome: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    endereco: new FormControl(''),
    senha: new FormControl('', [Validators.minLength(8)]),
    cpf: new FormControl({ value: '', disabled: true }),
    rg: new FormControl({ value: '', disabled: true }),
    curso: new FormControl({ value: '', disabled: true }),
    instituicaoNome: new FormControl({ value: '', disabled: true }),
    saldoMoedas: new FormControl<number | null>({ value: null, disabled: true })
  });

  ngOnInit(): void {
    this.loadStudentProfile();
  }

  private loadStudentProfile(): void {
    const user = this.authService.getCurrentUser();
    
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.profileService.getStudentProfile(user.id)
      .pipe(takeUntilDestroyed(this.destroyRef)) // 💡 Limpa a inscrição se o componente for destruído
      .subscribe({
        next: (profile: StudentProfile) => {
          // patchValue mapeia os dados da API diretamente para os FormControls
          this.profileForm.patchValue(profile);
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          this.handleHttpError(err, 'Erro ao carregar dados do perfil');
        }
      });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.errorMessage.set('Por favor, verifique os campos destacados.');
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);

    // 💡 Usa o RawValue do formulário, removendo a tipagem "any"
    const formValues = this.profileForm.value;
    
    const updateData: Partial<StudentProfile> & { senha?: string } = {
        nome: formValues.nome || '',
        email: formValues.email || '',
    };

    if (formValues.endereco?.trim()) {
      updateData.endereco = formValues.endereco.trim();
    }

    if (formValues.senha?.trim()) {
      updateData.senha = formValues.senha.trim();
    }

    this.profileService.updateStudentProfile(user.id, updateData as any)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedProfile) => {
          if (updatedProfile.nome) {
            this.authService.updateCurrentUserName(updatedProfile.nome);
          }
          this.saving.set(false);
          this.snack.open('Perfil atualizado com sucesso!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/alunos/painel']);
        },
        error: (err) => {
          this.saving.set(false);
          this.handleHttpError(err, 'Erro ao atualizar o perfil');
        }
      });
  }

  /**
   * 💡 Abstração para evitar repetição de código no tratamento de erros
   */
  private handleHttpError(err: any, fallbackMessage: string): void {
    console.error('Erro HTTP:', err);
    
    if (err.status === 401 || err.status === 403) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return;
    }

    const errorMsg = err?.error?.mensagem || err?.error?.message || fallbackMessage;
    this.errorMessage.set(errorMsg);
    this.snack.open(errorMsg, 'Fechar', { duration: 4000 });
  }
}