import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProfessorService } from '../../core/services/professor.service';
import { ProfessorResponse } from '../../core/models/api-models';
import { AppShellComponent } from '../../shared/components/app-shell.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { CardComponent } from '../../shared/components/card.component';
import { ButtonComponent } from '../../shared/components/button.component';

@Component({
  standalone: true,
  selector: 'app-professor-dashboard',
  imports: [CommonModule, RouterLink, AppShellComponent, PageHeaderComponent, CardComponent, ButtonComponent],
  template: `
    <app-shell>
      <div class="container">
        <app-page-header
          [title]="'Olá, Prof. ' + firstName()"
          subtitle="Reconheça o mérito dos seus alunos com moedas estudantis."
        ></app-page-header>

        <section class="hero">
          <div>
            <div class="hero__label">Saldo disponível</div>
            <div class="hero__value"><span>M$</span>{{ professor()?.saldoMoedas ?? 0 }}</div>
            <div class="hero__hint">{{ professor()?.departamento }} · {{ professor()?.instituicaoNome }}</div>
          </div>
          <app-button variant="accent" size="lg" routerLink="/professor/distribuir">
            <span class="material-icons">send</span>
            Distribuir moedas
          </app-button>
        </section>

        <div class="grid-2">
          <app-card title="Distribuir moedas" subtitle="Reconheça um aluno enviando moedas com uma mensagem.">
            <app-button variant="primary" routerLink="/professor/distribuir">Enviar agora</app-button>
          </app-card>
          <app-card title="Meu extrato" subtitle="Veja o histórico dos reconhecimentos que você já fez.">
            <app-button variant="ghost" routerLink="/professor/extrato">Abrir extrato</app-button>
          </app-card>
        </div>
      </div>
    </app-shell>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, var(--color-brand), #0a3358);
      color: #fff;
      border-radius: var(--radius-lg);
      padding: var(--space-7);
      margin-bottom: var(--space-6);
      display: flex; align-items: center; justify-content: space-between;
      gap: var(--space-5); flex-wrap: wrap;
      box-shadow: var(--shadow-md);
    }
    .hero__label { font-size: var(--text-sm); letter-spacing: 0.08em; text-transform: uppercase; opacity: .8; }
    .hero__value {
      font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 800; letter-spacing: -0.03em;
      display: flex; align-items: baseline; gap: var(--space-2); margin-top: var(--space-2);
      font-variant-numeric: tabular-nums;
    }
    .hero__value span { font-size: var(--text-xl); font-weight: 600; opacity: .75; }
    .hero__hint { margin-top: var(--space-2); opacity: .8; font-size: var(--text-sm); }
  `]
})
export class ProfessorDashboardComponent implements OnInit {
  private professorService = inject(ProfessorService);

  protected professor = signal<ProfessorResponse | null>(null);
  protected firstName = () => this.professor()?.nome.split(' ')[0] ?? '';

  ngOnInit(): void {
    this.professorService.getMe().subscribe({
      next: (p) => this.professor.set(p),
    });
  }
}
