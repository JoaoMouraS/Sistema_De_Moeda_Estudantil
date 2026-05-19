import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-intro',
  imports: [CommonModule],
  template: `
    <div class="intro" role="presentation">
      <div class="intro__brand">
        <span class="intro__mark">SC</span>
        <span class="intro__name">Student Coins</span>
      </div>
      <p class="intro__tagline">Reconhecendo mérito, conectando alunos e parceiros.</p>
      <div class="intro__dots" aria-hidden="true">
        <span></span><span></span><span></span>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .intro {
      min-height: 100vh;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: var(--space-5);
      background: linear-gradient(160deg, var(--color-brand) 0%, #0a3358 100%);
      color: #fff;
      animation: fade .6s ease;
    }
    .intro__brand { display: flex; align-items: center; gap: var(--space-3); font-weight: 700; font-size: var(--text-2xl); }
    .intro__mark {
      width: 56px; height: 56px;
      border-radius: var(--radius-lg);
      background: rgba(255,255,255,0.15);
      display: inline-flex; align-items: center; justify-content: center;
      font-size: var(--text-lg); font-weight: 800; letter-spacing: 0.05em;
    }
    .intro__tagline { color: rgba(255,255,255,0.85); font-size: var(--text-base); max-width: 480px; text-align: center; padding: 0 var(--space-4); }
    .intro__dots { display: flex; gap: var(--space-1); margin-top: var(--space-4); }
    .intro__dots span {
      width: 8px; height: 8px; border-radius: 50%;
      background: rgba(255,255,255,0.5);
      animation: pulse 1.2s ease-in-out infinite;
    }
    .intro__dots span:nth-child(2) { animation-delay: .2s; }
    .intro__dots span:nth-child(3) { animation-delay: .4s; }
    @keyframes pulse {
      0%, 100% { opacity: .3; transform: scale(.85); }
      50% { opacity: 1; transform: scale(1.1); }
    }
    @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class IntroComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private timerId: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    if (sessionStorage.getItem('introPlayed')) {
      this.router.navigate(['/home']);
      return;
    }
    sessionStorage.setItem('introPlayed', 'true');
    this.timerId = setTimeout(() => this.router.navigate(['/home']), 1800);
  }

  ngOnDestroy(): void {
    if (this.timerId) clearTimeout(this.timerId);
  }
}
