import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/api-models';
import { ButtonComponent } from '../../shared/components/button.component';
import { FormFieldComponent } from '../../shared/components/form-field.component';

const ROLE_ROUTES: Record<UserRole, string> = {
  ALUNO: '/alunos/painel',
  PROFESSOR: '/professor/painel',
  EMPRESA: '/empresas/vantagens',
  ADMIN: '/alunos',
};

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonComponent, FormFieldComponent],
  template: `
    <div class="auth">
      <aside class="auth__aside" aria-hidden="true">
        <a routerLink="/home" class="auth__brand">
          <span class="brand-mark">SC</span>
          Student Coins
        </a>

        <div class="auth__center">
          <div class="auth__tagline">
            <h2>Reconheça mérito.</h2>
            <h2>Recompense conquista.</h2>
          </div>

          <div class="coins-stage">
            <span class="coin coin--lg">M$</span>
            <span class="coin coin--md">M$</span>
            <span class="coin coin--sm">M$</span>
            <span class="material-icons-outlined coins-stage__hint coins-stage__hint--left">savings</span>
            <span class="material-icons-outlined coins-stage__hint coins-stage__hint--right">redeem</span>
          </div>
        </div>

        <p class="auth__hint">
          Plataforma da disciplina de Laboratório de Desenvolvimento de Software — PUC Minas.
        </p>
      </aside>

      <section class="auth__panel">
        <div class="auth__panel-inner">
          <header class="auth__head">
            <h1>{{ mode() === 'login' ? 'Entrar' : 'Criar conta' }}</h1>
            <p>{{ mode() === 'login' ? 'Acesse sua conta para gerenciar suas moedas.' : 'Escolha o perfil que melhor descreve você.' }}</p>
          </header>

          <ng-container *ngIf="mode() === 'login'; else signup">
            <form class="auth__form" [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
              <app-form-field
                label="E-mail"
                [required]="true"
                [hasError]="!!(form.get('email')?.invalid && form.get('email')?.touched)"
                error="Informe um e-mail válido"
              >
                <input type="email" formControlName="email" placeholder="voce@exemplo.com" autocomplete="email">
              </app-form-field>

              <app-form-field
                label="Senha"
                [required]="true"
                [hasError]="!!(form.get('senha')?.invalid && form.get('senha')?.touched)"
                error="Senha obrigatória"
              >
                <div class="password-wrap">
                  <input [type]="showPassword() ? 'text' : 'password'" formControlName="senha" placeholder="••••••••" autocomplete="current-password">
                  <button type="button" class="password-toggle" (click)="showPassword.set(!showPassword())" [attr.aria-label]="showPassword() ? 'Ocultar senha' : 'Mostrar senha'">
                    <span class="material-icons">{{ showPassword() ? 'visibility_off' : 'visibility' }}</span>
                  </button>
                </div>
              </app-form-field>

              <app-button variant="primary" size="lg" type="submit" [full]="true" [loading]="loading()" [disabled]="form.invalid">
                Entrar
              </app-button>

              <p class="auth__switch">
                Ainda não tem conta?
                <button type="button" class="link" (click)="mode.set('signup')">Criar agora</button>
              </p>
            </form>
          </ng-container>

          <ng-template #signup>
            <div class="auth__signup">
              <a routerLink="/alunos/novo" class="role-card">
                <span class="material-icons role-card__icon">school</span>
                <div>
                  <strong>Sou Aluno</strong>
                  <p>Cadastre-se para receber e gastar moedas estudantis.</p>
                </div>
                <span class="material-icons role-card__chevron">chevron_right</span>
              </a>

              <a routerLink="/empresas/novo" class="role-card">
                <span class="material-icons role-card__icon">business</span>
                <div>
                  <strong>Sou Empresa Parceira</strong>
                  <p>Ofereça vantagens em troca de moedas dos alunos.</p>
                </div>
                <span class="material-icons role-card__chevron">chevron_right</span>
              </a>

              <div class="role-card role-card--info">
                <span class="material-icons role-card__icon">badge</span>
                <div>
                  <strong>Sou Professor</strong>
                  <p>Professores são cadastrados pela instituição. Faça login com as credenciais recebidas.</p>
                </div>
              </div>

              <p class="auth__switch">
                Já tem conta?
                <button type="button" class="link" (click)="mode.set('login')">Entrar</button>
              </p>
            </div>
          </ng-template>

          <a routerLink="/home" class="auth__back">
            <span class="material-icons">arrow_back</span>
            Voltar ao início
          </a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
    .auth {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 5fr 7fr;
      background: var(--color-bg-app);
    }
    @media (max-width: 880px) {
      .auth { grid-template-columns: 1fr; }
      .auth__aside { display: none; }
    }

    .auth__aside {
      position: relative;
      overflow: hidden;
      background: linear-gradient(165deg, #1968a3 0%, var(--color-brand) 55%, #103e63 100%);
      color: #fff;
      padding: var(--space-8);
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .auth__aside::before {
      content: '';
      position: absolute;
      top: -120px; right: -120px;
      width: 360px; height: 360px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(242, 177, 57, 0.16) 0%, transparent 70%);
      pointer-events: none;
    }

    .auth__center {
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: var(--space-7);
    }
    .auth__tagline { display: flex; flex-direction: column; gap: var(--space-1); }

    .coins-stage {
      position: relative;
      width: 280px;
      height: 160px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .coin {
      position: absolute;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--color-accent), var(--color-accent-hover));
      color: #1a1a1a;
      font-weight: 800;
      box-shadow: 0 10px 24px rgba(0,0,0,0.3), inset 0 -3px 0 rgba(0,0,0,0.12);
      animation: float-decor 4.5s ease-in-out infinite;
    }
    .coin--lg { width: 88px; height: 88px; font-size: 22px; z-index: 3; animation-delay: 0s; }
    .coin--md { width: 60px; height: 60px; font-size: 15px; transform: translate(-78px, 20px); z-index: 2; animation-delay: -1.5s; }
    .coin--sm { width: 50px; height: 50px; font-size: 13px; transform: translate(72px, 24px); z-index: 2; animation-delay: -3s; opacity: .9; }

    .coins-stage__hint {
      position: absolute;
      color: rgba(255,255,255,0.28);
      font-size: 36px !important;
      animation: float-decor 5.5s ease-in-out infinite;
    }
    .coins-stage__hint--left { left: 0; top: 10%; animation-delay: -2s; }
    .coins-stage__hint--right { right: 0; bottom: 8%; animation-delay: -4s; }

    @keyframes float-decor {
      0%, 100% { transform-origin: center; }
      50% { translate: 0 -8px; }
    }
    .coin--md { animation: float-md 4.5s ease-in-out infinite; }
    .coin--sm { animation: float-sm 4.5s ease-in-out infinite; }
    @keyframes float-md {
      0%, 100% { transform: translate(-78px, 20px); }
      50% { transform: translate(-78px, 12px); }
    }
    @keyframes float-sm {
      0%, 100% { transform: translate(72px, 24px); }
      50% { transform: translate(72px, 16px); }
    }
    .auth__brand {
      color: #fff;
      font-weight: 700;
      font-size: var(--text-xl);
      display: inline-flex;
      align-items: center;
      gap: var(--space-3);
    }
    .brand-mark {
      width: 36px; height: 36px;
      border-radius: var(--radius-md);
      background: rgba(255,255,255,0.16);
      display: inline-flex; align-items: center; justify-content: center;
      font-weight: 800;
    }
    .auth__tagline h2 {
      font-size: clamp(1.6rem, 3vw, 2.4rem);
      color: #fff;
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1.15;
    }
    .auth__tagline h2 + h2 { color: rgba(255,255,255,0.75); }
    .auth__hint {
      color: rgba(255,255,255,0.75);
      font-size: var(--text-sm);
      max-width: 320px;
    }

    .auth__panel {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-8) var(--space-6);
    }
    .auth__panel-inner {
      width: 100%;
      max-width: 420px;
      display: flex;
      flex-direction: column;
      gap: var(--space-7);
    }
    .auth__head h1 {
      font-size: var(--text-3xl);
      letter-spacing: -0.02em;
      font-weight: 700;
    }
    .auth__head p {
      margin-top: var(--space-2);
      color: var(--color-text-muted);
    }

    .auth__form { display: flex; flex-direction: column; gap: var(--space-5); }
    .password-wrap { position: relative; }
    .password-toggle {
      position: absolute;
      top: 50%; right: var(--space-2);
      transform: translateY(-50%);
      padding: var(--space-1) var(--space-2);
      color: var(--color-text-muted);
      cursor: pointer;
      display: inline-flex; align-items: center;
      border-radius: var(--radius-sm);
    }
    .password-toggle:hover { color: var(--color-brand); background: var(--color-brand-soft); }

    .auth__switch {
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      text-align: center;
    }
    .link {
      color: var(--color-brand);
      font-weight: 600;
      padding: 0 var(--space-1);
      cursor: pointer;
    }
    .link:hover { text-decoration: underline; }

    .auth__signup { display: flex; flex-direction: column; gap: var(--space-3); }
    .role-card {
      display: flex; align-items: center; gap: var(--space-4);
      padding: var(--space-4) var(--space-5);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: var(--color-surface);
      transition: border-color .15s, box-shadow .15s, transform .1s;
      color: var(--color-text);
    }
    .role-card:hover {
      border-color: var(--color-brand);
      box-shadow: var(--shadow-sm);
    }
    .role-card:active { transform: translateY(1px); }
    .role-card__icon {
      width: 42px; height: 42px;
      border-radius: var(--radius-md);
      background: var(--color-brand-soft);
      color: var(--color-brand);
      display: inline-flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .role-card strong { display: block; font-size: var(--text-base); }
    .role-card p { font-size: var(--text-sm); margin-top: 2px; }
    .role-card__chevron { color: var(--color-text-muted); margin-left: auto; }
    .role-card--info { cursor: default; }
    .role-card--info:hover { border-color: var(--color-border); box-shadow: none; }
    .role-card--info .role-card__icon { background: var(--color-surface-alt); color: var(--color-text-muted); }

    .auth__back {
      align-self: center;
      display: inline-flex; align-items: center; gap: var(--space-1);
      color: var(--color-text-muted);
      font-size: var(--text-sm);
    }
    .auth__back .material-icons { font-size: 18px; }
    .auth__back:hover { color: var(--color-brand); }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  protected mode = signal<'login' | 'signup'>('login');
  protected showPassword = signal(false);
  protected loading = signal(false);

  protected form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.auth.login(this.form.getRawValue()).subscribe({
      next: (res) => {
        this.loading.set(false);
        const target = ROLE_ROUTES[res.tipoUsuario as UserRole] ?? '/home';
        this.router.navigate([target]);
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.mensagem ?? 'Falha ao autenticar.';
        this.snack.open(msg, 'Fechar', { duration: 4000, panelClass: ['snackbar-error'] });
      },
    });
  }
}
