import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppShellComponent } from '../../shared/components/app-shell.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { CardComponent } from '../../shared/components/card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';

@Component({
  standalone: true,
  selector: 'app-empresa-vantagens',
  imports: [CommonModule, AppShellComponent, PageHeaderComponent, CardComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-shell>
      <div class="container">
        <app-page-header
          title="Vantagens"
          subtitle="Ofertas que sua empresa disponibiliza aos alunos."
        ></app-page-header>

        <app-card [padded]="false">
          <app-empty-state
            icon="redeem"
            title="Você ainda não cadastrou vantagens"
            description="Em breve será possível cadastrar produtos e descontos que os alunos poderão resgatar com suas moedas."
          ></app-empty-state>
        </app-card>
      </div>
    </app-shell>
  `
})
export class EmpresaVantagensComponent {}
