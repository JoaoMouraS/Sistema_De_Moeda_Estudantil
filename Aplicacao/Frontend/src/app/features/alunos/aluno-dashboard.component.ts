import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { AppShellComponent } from '../../shared/components/app-shell.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { CardComponent } from '../../shared/components/card.component';
import { ButtonComponent } from '../../shared/components/button.component';

@Component({
  standalone: true,
  selector: 'app-aluno-dashboard',
  imports: [CommonModule, RouterLink, AppShellComponent, PageHeaderComponent, CardComponent, ButtonComponent],
  template: `
    <app-shell>
      <div class="container">
        <app-page-header
          [title]="'Olá, ' + firstName"
          subtitle="Acompanhe seu saldo de moedas e acesse rapidamente o que precisa."
        ></app-page-header>

        <section class="hero">
          <div>
            <div class="hero__label">Saldo atual</div>
            <div class="hero__value"><span>M$</span>{{ saldo() }}</div>
          </div>
          <app-button variant="accent" size="lg" routerLink="/alunos/extrato">
            <span class="material-icons">receipt_long</span>
            Ver extrato
          </app-button>
        </section>

        <div class="grid-2">
          <app-card title="Extrato" subtitle="Histórico de transações recentes e saldo detalhado.">
            <app-button variant="ghost" routerLink="/alunos/extrato">Acessar</app-button>
          </app-card>
          <app-card title="Meu perfil" subtitle="Atualize dados pessoais e altere sua senha.">
            <app-button variant="ghost" routerLink="/alunos/editar-perfil">Editar</app-button>
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
      gap: var(--space-5);
      box-shadow: var(--shadow-md);
      flex-wrap: wrap;
    }
    .hero__label {
      font-size: var(--text-sm);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      opacity: .8;
    }
    .hero__value {
      font-size: clamp(2.5rem, 5vw, 3.5rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      display: flex; align-items: baseline; gap: var(--space-2);
      font-variant-numeric: tabular-nums;
    }
    .hero__value span { font-size: var(--text-xl); font-weight: 600; opacity: .75; }
  `]
})
export class AlunoDashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private profileService = inject(ProfileService);
  private router = inject(Router);

  protected firstName = 'Aluno';
  protected saldo = signal(0);

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.firstName = user.nome.split(' ')[0];
    this.profileService.getStudentProfile(user.id).subscribe({
      next: (p) => this.saldo.set(p.saldoMoedas),
    });
  }
}
