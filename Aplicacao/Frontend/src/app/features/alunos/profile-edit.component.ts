import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileService, StudentProfile } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';

/**
 * ProfileEditComponent - Componente para edição do perfil do aluno
 * 
 * Responsabilidades:
 * - Exibir formulário reativo com dados atuais do aluno
 * - Validar campos em tempo real
 * - Atualizar perfil no backend
 * - Exibir mensagens de sucesso/erro
 * - Mostrar estado de carregamento
 */
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
        <mat-card class="profile-card">
          <mat-card-header>
            <mat-card-title>Dados Pessoais</mat-card-title>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
              <!-- Nome Completo -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Nome Completo</mat-label>
                <input matInput formControlName="nome" type="text" required />
                <mat-error *ngIf="profileForm.get('nome')?.hasError('required')">
                  Nome é obrigatório
                </mat-error>
                <mat-error *ngIf="profileForm.get('nome')?.hasError('minlength')">
                  Nome deve ter no mínimo 3 caracteres
                </mat-error>
              </mat-form-field>

              <!-- Email -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" type="email" required />
                <mat-error *ngIf="profileForm.get('email')?.hasError('required')">
                  Email é obrigatório
                </mat-error>
                <mat-error *ngIf="profileForm.get('email')?.hasError('email')">
                  Email inválido
                </mat-error>
              </mat-form-field>

              <!-- Endereço -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Endereço (Opcional)</mat-label>
                <textarea matInput formControlName="endereco" rows="3"></textarea>
              </mat-form-field>

              <!-- Senha (Opcional) -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Nova Senha (Deixe em branco para não alterar)</mat-label>
                <input matInput formControlName="senha" type="password" />
                <mat-error *ngIf="profileForm.get('senha')?.hasError('minlength')">
                  Senha deve ter no mínimo 8 caracteres
                </mat-error>
              </mat-form-field>

              <!-- Dados Imutáveis (Somente Leitura) -->
              <fieldset class="readonly-section" disabled>
                <legend>Informações de Registro</legend>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>CPF</mat-label>
                  <input matInput [value]="profileForm.get('cpf')?.value" readonly />
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>RG</mat-label>
                  <input matInput [value]="profileForm.get('rg')?.value" readonly />
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Curso</mat-label>
                  <input matInput [value]="profileForm.get('curso')?.value" readonly />
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Instituição</mat-label>
                  <input matInput [value]="profileForm.get('instituicaoNome')?.value" readonly />
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Saldo de Moedas</mat-label>
                  <input matInput [value]="profileForm.get('saldoMoedas')?.value" readonly />
                </mat-form-field>
              </fieldset>

              <!-- Mensagens de Erro -->
              <div *ngIf="errorMessage()" class="error-message">
                <mat-icon>error</mat-icon>
                <span>{{ errorMessage() }}</span>
              </div>

              <!-- Botões de Ação -->
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
                  [disabled]="!profileForm.valid || saving()"
                >
                  <mat-spinner *ngIf="saving()" diameter="20" class="button-spinner"></mat-spinner>
                  {{ saving() ? 'Salvando...' : 'Salvar Alterações' }}
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </main>
    </div>
  `,
  styles: [`
    @import url('https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css');

    .profile-container {
      min-height: 100vh;
      background-color: #f4f7f6;
      padding: 24px;
      font-family: Inter, system-ui, -apple-system, 'Segoe UI', sans-serif;
    }
    .profile-header {
      max-width: 800px;
      margin: 0 auto 24px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #1e3c72;
      text-decoration: none;
      font-weight: 600;
      width: fit-content;
    }
    h1 {
      margin: 0;
      font-size: 2rem;
      color: #111827;
    }
    .subtitle {
      margin: 0;
      color: #5f677a;
      max-width: 680px;
    }
    .profile-content {
      max-width: 800px;
      margin: 0 auto;
    }
    .profile-card {
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.06);
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    .readonly-section {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      background-color: #fafafa;
    }
    .readonly-section legend {
      font-weight: 600;
      color: #555;
      padding: 0 8px;
    }
    .readonly-section fieldset:disabled {
      opacity: 0.7;
    }
    .error-message {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #d93025;
      background-color: #fce8e6;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 24px;
    }
    .button-spinner {
      display: inline-block;
      margin-right: 8px;
    }
    @media (max-width: 768px) {
      .profile-container {
        padding: 16px;
      }
      .profile-card {
        border-radius: 8px;
      }
      h1 {
        font-size: 1.5rem;
      }
      .form-actions {
        flex-direction: column;
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
  private route = inject(ActivatedRoute);

  profileForm!: FormGroup;
  saving = signal(false);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.initializeForm();
    this.loadStudentProfile();
  }

  /**
   * Inicializa o formulário reativo com validadores
   * 
   * Validações aplicadas:
   * - nome: obrigatório, mínimo 3 caracteres
   * - email: obrigatório, formato válido
   * - endereco: opcional
   * - senha: opcional, mínimo 8 caracteres se preenchida
   */
  private initializeForm(): void {
    this.profileForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      endereco: [''],
      senha: ['', Validators.minLength(8)],
      cpf: [{ value: '', disabled: true }],
      rg: [{ value: '', disabled: true }],
      curso: [{ value: '', disabled: true }],
      instituicaoNome: [{ value: '', disabled: true }],
      saldoMoedas: [{ value: '', disabled: true }]
    });
  }

  /**
   * Carrega os dados atuais do perfil do aluno
   * 
   * Fluxo:
   * 1. Obtém o ID do aluno do AuthService
   * 2. Chamada GET ao backend
   * 3. Preenche o formulário com os dados
   * 4. Exibe erro se falhar
   */
  private loadStudentProfile(): void {
    const user = this.authService.getCurrentUser();
    console.log('🔍 Usuário recuperado:', user);
    
    if (!user) {
      console.error('❌ Nenhum usuário logado');
      this.router.navigate(['/login']);
      return;
    }

    console.log('📡 Carregando perfil do aluno ID:', user.id);
    this.profileService.getStudentProfile(user.id).subscribe({
      next: (profile: StudentProfile) => {
        console.log('✅ Perfil carregado:', profile);
        this.populateForm(profile);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Erro ao carregar perfil:', err);
        this.snack.open('Erro ao carregar dados do perfil', 'Fechar', { duration: 4000 });
        this.loading.set(false);
        this.router.navigate(['/alunos/painel']);
      }
    });
  }

  /**
   * Popula o formulário com os dados do perfil
   */
  private populateForm(profile: StudentProfile): void {
    this.profileForm.patchValue({
      nome: profile.nome,
      email: profile.email,
      endereco: profile.endereco || '',
      cpf: profile.cpf,
      rg: profile.rg,
      curso: profile.curso,
      instituicaoNome: profile.instituicaoNome,
      saldoMoedas: profile.saldoMoedas
    });
  }

  /**
   * Submete o formulário para atualização
   * 
   * Fluxo:
   * 1. Valida o formulário
   * 2. Mostra estado de carregamento
   * 3. Envia os dados ao backend
   * 4. Exibe sucesso ou erro
   * 5. Redireciona ao painel se sucesso
   */
  onSubmit(): void {
    if (!this.profileForm.valid) {
      this.errorMessage.set('Por favor, preencha todos os campos obrigatórios corretamente');
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);

    const user = this.authService.getCurrentUser();
    if (!user) {
      console.error('❌ Nenhum usuário logado');
      this.router.navigate(['/login']);
      return;
    }

    const updateData = {
      nome: this.profileForm.get('nome')?.value,
      email: this.profileForm.get('email')?.value,
      endereco: this.profileForm.get('endereco')?.value || null,
      senha: this.profileForm.get('senha')?.value || null
    };

    console.log('📤 Atualizando perfil do aluno ID:', user.id);
    console.log('📦 Dados enviados:', updateData);

    this.profileService.updateStudentProfile(user.id, updateData).subscribe({
      next: (updatedProfile) => {
        console.log('✅ Perfil atualizado:', updatedProfile);
        this.saving.set(false);
        this.snack.open('Perfil atualizado com sucesso!', 'Fechar', { duration: 3000 });
        this.router.navigate(['/alunos/painel']);
      },
      error: (err) => {
        console.error('❌ Erro ao atualizar perfil:', err);
        this.saving.set(false);
        const errorMsg = err?.error?.mensagem || 'Erro ao atualizar perfil';
        this.errorMessage.set(errorMsg);
        this.snack.open(errorMsg, 'Fechar', { duration: 4000 });
      }
    });
  }
}
