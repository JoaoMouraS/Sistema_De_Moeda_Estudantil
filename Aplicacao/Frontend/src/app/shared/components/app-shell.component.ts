import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface NavLink {
  label: string;
  to: string;
  icon: string;
}

@Component({
  standalone: true,
  selector: 'app-shell',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="shell">
      <header class="topbar">
        <div class="container topbar__inner">
          <a routerLink="/home" class="brand">
            <span class="brand__mark">SC</span>
            <span class="brand__text">Student Coins</span>
          </a>

          <nav class="nav" *ngIf="navLinks().length" aria-label="Navegação principal">
            <a *ngFor="let link of navLinks()"
               [routerLink]="link.to"
               routerLinkActive="nav__link--active"
               class="nav__link">
              <span class="material-icons" aria-hidden="true">{{ link.icon }}</span>
              <span>{{ link.label }}</span>
            </a>
          </nav>

          <div class="topbar__user">
            <ng-container *ngIf="user(); else loggedOut">
              <button class="user-menu" (click)="menuOpen.set(!menuOpen())" type="button">
                <span class="user-menu__avatar">{{ initials() }}</span>
                <span class="user-menu__name">{{ user()!.nome }}</span>
                <span class="material-icons user-menu__caret">expand_more</span>
              </button>
              <div class="user-menu__dropdown" *ngIf="menuOpen()" (click)="menuOpen.set(false)">
                <span class="user-menu__role">{{ user()!.tipoUsuario }}</span>
                <button type="button" class="user-menu__item" (click)="logout()">
                  <span class="material-icons" aria-hidden="true">logout</span>
                  Sair
                </button>
              </div>
            </ng-container>
            <ng-template #loggedOut>
              <a routerLink="/login" class="btn-link">Entrar</a>
            </ng-template>
          </div>
        </div>
      </header>

      <main class="shell__main">
        <div class="container shell__container">
          <ng-content></ng-content>
        </div>
      </main>

      <footer class="footer">
        <div class="container footer__inner">
          <span>© {{ year }} Student Coins</span>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
    .shell { display: flex; flex-direction: column; min-height: 100vh; background: var(--color-bg-app); }
    .shell__main { flex: 1; padding: var(--space-8) 0 var(--space-9); }
    .shell__container { width: 100%; }

    .topbar {
      position: sticky;
      top: 0;
      z-index: 50;
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      height: var(--topbar-height);
      display: flex;
      align-items: center;
    }
    .topbar__inner {
      display: flex;
      align-items: center;
      gap: var(--space-6);
      height: 100%;
    }
    .brand {
      display: inline-flex; align-items: center; gap: var(--space-2);
      font-weight: 700; font-size: var(--text-lg);
      color: var(--color-text);
    }
    .brand__mark {
      width: 32px; height: 32px;
      border-radius: var(--radius-md);
      background: var(--color-brand);
      color: #fff;
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 700; letter-spacing: 0.5px;
    }

    .nav {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      margin-left: auto;
      margin-right: var(--space-4);
    }
    .nav__link {
      display: inline-flex; align-items: center; gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--color-text-muted);
      border-radius: var(--radius-md);
      transition: color .15s, background .15s;
    }
    .nav__link:hover { color: var(--color-text); background: var(--color-surface-alt); }
    .nav__link--active { color: var(--color-brand); background: var(--color-brand-soft); }
    .nav__link .material-icons { font-size: 18px; }

    .topbar__user { display: flex; align-items: center; position: relative; }
    .btn-link {
      color: var(--color-brand);
      font-weight: 600;
      padding: var(--space-2) var(--space-3);
    }

    .user-menu {
      display: inline-flex; align-items: center; gap: var(--space-2);
      padding: var(--space-1) var(--space-2) var(--space-1) var(--space-1);
      border-radius: var(--radius-full);
      border: 1px solid var(--color-border);
      background: var(--color-surface);
      cursor: pointer;
      transition: border-color .15s;
    }
    .user-menu:hover { border-color: var(--color-border-strong); }
    .user-menu__avatar {
      width: 30px; height: 30px;
      border-radius: 50%;
      background: var(--color-brand);
      color: #fff;
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700;
    }
    .user-menu__name { font-size: var(--text-sm); font-weight: 500; }
    .user-menu__caret { font-size: 18px !important; color: var(--color-text-muted); }
    .user-menu__dropdown {
      position: absolute; top: calc(100% + 6px); right: 0;
      min-width: 200px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-md);
      padding: var(--space-2);
      z-index: 60;
    }
    .user-menu__role {
      display: block;
      padding: var(--space-2) var(--space-3);
      font-size: var(--text-xs);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .user-menu__item {
      width: 100%;
      display: flex; align-items: center; gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-sm);
      font-size: var(--text-sm);
      color: var(--color-text);
      text-align: left;
    }
    .user-menu__item:hover { background: var(--color-surface-alt); color: var(--color-danger); }
    .user-menu__item .material-icons { font-size: 18px; }

    .footer {
      background: var(--color-surface);
      border-top: 1px solid var(--color-border);
      padding: var(--space-5) 0;
      color: var(--color-text-muted);
      font-size: var(--text-xs);
    }
    .footer__inner { text-align: center; }

    @media (max-width: 760px) {
      .nav { display: none; }
      .user-menu__name { display: none; }
      .brand__text { display: none; }
    }
  `]
})
export class AppShellComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  protected user = signal(this.auth.getCurrentUser());
  protected menuOpen = signal(false);
  protected year = new Date().getFullYear();

  protected navLinks = computed<NavLink[]>(() => {
    const u = this.user();
    if (!u) return [];
    const role = u.tipoUsuario?.toUpperCase();
    switch (role) {
      case 'ALUNO':
        return [
          { label: 'Painel', to: '/alunos/painel', icon: 'dashboard' },
          { label: 'Extrato', to: '/alunos/extrato', icon: 'receipt_long' },
          { label: 'Perfil', to: '/alunos/editar-perfil', icon: 'person' },
        ];
      case 'PROFESSOR':
        return [
          { label: 'Painel', to: '/professor/painel', icon: 'dashboard' },
          { label: 'Distribuir', to: '/professor/distribuir', icon: 'send' },
          { label: 'Extrato', to: '/professor/extrato', icon: 'receipt_long' },
        ];
      case 'EMPRESA':
        return [
          { label: 'Perfil', to: '/empresas/editar', icon: 'business' },
          { label: 'Vantagens', to: '/empresas/vantagens', icon: 'redeem' },
          { label: 'Trocas', to: '/empresas/relatorio', icon: 'receipt_long' },
        ];
      case 'ADMIN':
        return [
          { label: 'Alunos', to: '/alunos', icon: 'group' },
          { label: 'Empresas', to: '/empresas', icon: 'business' },
        ];
      default:
        return [];
    }
  });

  protected initials(): string {
    const u = this.user();
    if (!u?.nome) return '?';
    return u.nome.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]!.toUpperCase()).join('');
  }

  protected logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
