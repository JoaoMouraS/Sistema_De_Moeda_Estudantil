import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, CurrentUser } from '../../core/services/auth.service';
import { AppShellComponent } from '../../shared/components/app-shell.component';
import { CardComponent } from '../../shared/components/card.component';
import { ButtonComponent } from '../../shared/components/button.component';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterLink, AppShellComponent, CardComponent, ButtonComponent],
  template: `
    <app-shell>
      <div class="container">
        <section class="hero">
          <div class="hero__copy">
            <span class="eyebrow">Sistema de Moeda Estudantil</span>
            <h1>Reconheça mérito acadêmico de forma simples e justa.</h1>
            <p>Professores distribuem moedas como reconhecimento. Empresas parceiras oferecem vantagens. Alunos colhem os benefícios do esforço.</p>
            <div class="hero__cta">
              <ng-container *ngIf="!user(); else loggedActions">
                <app-button variant="primary" size="lg" routerLink="/login">Entrar</app-button>
                <app-button variant="secondary" size="lg" routerLink="/alunos/novo">Cadastrar como aluno</app-button>
              </ng-container>
              <ng-template #loggedActions>
                <app-button variant="primary" size="lg" [routerLink]="homeRoute()">Ir para o painel</app-button>
              </ng-template>
            </div>
          </div>
          <div class="hero__art" aria-hidden="true">
            <div class="badge-stack">
              <div class="coin coin--1">M$</div>
              <div class="coin coin--2">M$</div>
              <div class="coin coin--3">M$</div>
            </div>
          </div>
        </section>

        <section class="how">
          <h2>Como funciona</h2>
          <div class="grid-3 cards">
            <app-card>
              <div class="step">
                <span class="material-icons step__icon">school</span>
                <h3>Alunos cadastram-se</h3>
                <p>Informe seus dados, escolha a instituição e participe do programa de mérito.</p>
              </div>
            </app-card>
            <app-card>
              <div class="step">
                <span class="material-icons step__icon">redeem</span>
                <h3>Professores reconhecem</h3>
                <p>Cada professor recebe 1.000 moedas por semestre para distribuir como reconhecimento.</p>
              </div>
            </app-card>
            <app-card>
              <div class="step">
                <span class="material-icons step__icon">storefront</span>
                <h3>Empresas oferecem vantagens</h3>
                <p>Parceiros cadastram benefícios para os alunos trocarem por moedas.</p>
              </div>
            </app-card>
          </div>
        </section>
      </div>
    </app-shell>
  `,
  styles: [`
    .hero {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: var(--space-7);
      align-items: center;
      padding: var(--space-8) 0 var(--space-9);
    }
    .hero__copy { display: flex; flex-direction: column; gap: var(--space-4); }
    .eyebrow {
      font-size: var(--text-xs);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--color-brand);
      font-weight: 700;
    }
    .hero h1 {
      font-size: clamp(2rem, 4vw, 3rem);
      letter-spacing: -0.02em;
      line-height: 1.1;
    }
    .hero p {
      font-size: var(--text-lg);
      color: var(--color-text-muted);
      max-width: 540px;
      line-height: 1.55;
    }
    .hero__cta { display: flex; gap: var(--space-3); flex-wrap: wrap; margin-top: var(--space-4); }

    .hero__art {
      aspect-ratio: 1;
      max-width: 380px;
      justify-self: center;
      width: 100%;
      position: relative;
      background: radial-gradient(circle at center, var(--color-brand-soft) 0%, transparent 70%);
      border-radius: 50%;
    }
    .badge-stack { position: absolute; inset: 0; }
    .coin {
      position: absolute;
      width: 100px; height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--color-accent), var(--color-accent-hover));
      color: #1a1a1a;
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: var(--text-2xl);
      box-shadow: var(--shadow-lg);
      animation: float 4s ease-in-out infinite;
    }
    .coin--1 { top: 20%; left: 18%; animation-delay: 0s; }
    .coin--2 { top: 30%; right: 12%; animation-delay: -1.3s; width: 80px; height: 80px; font-size: var(--text-xl); }
    .coin--3 { bottom: 14%; left: 32%; animation-delay: -2.6s; width: 60px; height: 60px; font-size: var(--text-lg); }
    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }

    .how { padding: var(--space-7) 0 var(--space-8); }
    .how h2 { font-size: var(--text-2xl); margin-bottom: var(--space-5); }
    .step { display: flex; flex-direction: column; gap: var(--space-3); }
    .step__icon {
      width: 44px; height: 44px;
      border-radius: var(--radius-md);
      background: var(--color-brand-soft);
      color: var(--color-brand);
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 24px !important;
    }
    .step h3 { font-size: var(--text-lg); }
    .step p { color: var(--color-text-muted); font-size: var(--text-sm); line-height: var(--leading-relaxed); }

    @media (max-width: 880px) {
      .hero { grid-template-columns: 1fr; }
      .hero__art { display: none; }
    }
  `]
})
export class HomeComponent implements OnInit {
  private auth = inject(AuthService);
  protected user = signal<CurrentUser | null>(null);

  ngOnInit(): void {
    this.user.set(this.auth.getCurrentUser());
  }

  protected homeRoute(): string {
    const role = this.user()?.tipoUsuario;
    switch (role) {
      case 'ALUNO': return '/alunos/painel';
      case 'PROFESSOR': return '/professor/painel';
      case 'EMPRESA': return '/empresas/vantagens';
      case 'ADMIN': return '/alunos';
      default: return '/login';
    }
  }
}
