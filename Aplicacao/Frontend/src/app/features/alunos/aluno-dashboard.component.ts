import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-aluno-dashboard',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-page">
      <header class="dashboard-header">
        <a routerLink="/home" class="back-link" aria-label="Voltar para a página inicial">
          <i class="bx bx-arrow-back" aria-hidden="true"></i> Voltar
        </a>
        <div>
          <p class="eyebrow">Painel do Aluno</p>
          <h1>Bem-vindo de volta, {{ userName }}</h1>
          <p class="subtitle">Aqui você pode acompanhar seu saldo, acessos rápidos ao extrato e a suas vantagens.</p>
        </div>
      </header>

      <main class="dashboard-grid">
        <section class="panel-card balance-card">
          <div>
            <p class="card-label">Saldo Atual</p>
            <p class="card-value">M$ {{ saldo }}</p>
          </div>
          <a routerLink="/alunos/extrato" class="card-action">Ver Extrato</a>
        </section>

        <section class="panel-card">
          <h2>Extrato de Moedas</h2>
          <p>Visualize todas as suas transações de créditos e débitos.</p>
          <a routerLink="/alunos/extrato" class="card-action">Abrir Extrato</a>
        </section>

        <section class="panel-card">
          <h2>Meu Perfil</h2>
          <p>Edite suas informações pessoais e dados de contato.</p>
          <a routerLink="/alunos/editar-perfil" class="card-action">Editar Perfil</a>
        </section>
      </main>
    </div>
  `,
  styles: [`
    @import url('https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css');

    .dashboard-page {
      min-height: 100vh;
      padding: 24px;
      background: #f4f7f6;
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .dashboard-header {
      max-width: 920px;
      margin: 0 auto 28px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #1e3c72;
      font-weight: 600;
      text-decoration: none;
    }
    .eyebrow {
      margin: 0;
      text-transform: uppercase;
      color: #4f5d78;
      font-size: 0.85rem;
      letter-spacing: 0.14em;
    }
    h1 {
      margin: 0;
      font-size: clamp(2rem, 2.5vw, 2.75rem);
      color: #111827;
    }
    .subtitle {
      margin: 0;
      color: #5f677a;
      max-width: 680px;
      line-height: 1.6;
    }
    .dashboard-grid {
      max-width: 920px;
      margin: 0 auto;
      display: grid;
      gap: 20px;
    }
    .panel-card {
      background: #fff;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 12px 32px rgba(0,0,0,0.06);
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .balance-card {
      border-left: 4px solid #1e3c72;
    }
    .card-label {
      margin: 0;
      color: #6b7280;
      text-transform: uppercase;
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 0.12em;
    }
    .card-value {
      margin: 0;
      font-size: 2.4rem;
      font-weight: 800;
      color: #111827;
    }
    .card-action {
      align-self: start;
      color: #1e3c72;
      font-weight: 700;
      text-decoration: none;
      border: 1px solid #1e3c72;
      border-radius: 999px;
      padding: 10px 18px;
      transition: background-color 0.2s ease, color 0.2s ease;
    }
    .card-action:hover {
      background: #1e3c72;
      color: white;
    }
    @media (min-width: 768px) {
      .dashboard-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }
  `]
})
export class AlunoDashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  userName = 'Aluno';
  saldo = 0;

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.userName = user.nome.split(' ')[0];
    this.saldo = 1250;
  }
}
