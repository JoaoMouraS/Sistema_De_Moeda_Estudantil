import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfessorService } from '../../core/services/professor.service';
import { AlunoService } from '../../core/services/aluno.service';
import { AuthService } from '../../core/services/auth.service';
import { AlunoResponse, DistribuirMoedasRequest, ProfessorResponse } from '../../core/models/api-models';
import { AppShellComponent } from '../../shared/components/app-shell.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { CardComponent } from '../../shared/components/card.component';
import { ButtonComponent } from '../../shared/components/button.component';
import { FormFieldComponent } from '../../shared/components/form-field.component';

@Component({
  standalone: true,
  selector: 'app-distribuir-moedas',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppShellComponent,
    PageHeaderComponent,
    CardComponent,
    ButtonComponent,
    FormFieldComponent,
  ],
  template: `
    <app-shell>
      <div class="container-narrow">
        <app-page-header
          title="Distribuir moedas"
          subtitle="Reconheça o mérito de um aluno enviando moedas com uma mensagem aberta."
          backTo="/professor/painel"
        ></app-page-header>

        <div class="balance-strip" *ngIf="professor() as p">
          <span class="material-icons">monetization_on</span>
          <div>
            <div class="balance-strip__label">Saldo disponível</div>
            <div class="balance-strip__value">M$ {{ p.saldoMoedas }}</div>
          </div>
        </div>

        <app-card>
          <form class="form" [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
            <app-form-field
              label="Aluno"
              [required]="true"
              hint="Selecione o aluno que receberá o reconhecimento"
              [hasError]="invalid('alunoId')"
              error="Selecione um aluno"
            >
              <select formControlName="alunoId">
                <option [ngValue]="0" disabled>Escolha um aluno</option>
                @for (a of alunos(); track a.id) {
                  <option [ngValue]="a.id">{{ a.nome }} — {{ a.instituicaoNome }}</option>
                }
              </select>
            </app-form-field>

            <app-form-field
              label="Quantidade de moedas"
              [required]="true"
              [hint]="'Mínimo 1, máximo ' + maxQuantidade()"
              [hasError]="invalid('quantidade') || saldoInsuficiente()"
              [error]="saldoInsuficiente() ? 'Saldo insuficiente para esta quantia' : 'Informe uma quantidade válida'"
            >
              <input type="number" formControlName="quantidade" [min]="1" [max]="maxQuantidade()" placeholder="0">
            </app-form-field>

            <app-form-field
              label="Mensagem de reconhecimento"
              [required]="true"
              hint="Mínimo 10 caracteres — explique por que o aluno está sendo reconhecido"
              [hasError]="invalid('mensagem')"
              error="Mensagem deve ter no mínimo 10 caracteres"
            >
              <textarea formControlName="mensagem" rows="4" placeholder="Ex.: Excelente participação no debate de hoje."></textarea>
            </app-form-field>

            <div class="preview" *ngIf="quantidadeValida()">
              <span class="material-icons-outlined">info</span>
              <span>Após o envio, seu saldo passará de <strong>M$ {{ professor()?.saldoMoedas ?? 0 }}</strong> para <strong>M$ {{ saldoAposEnvio() }}</strong>.</span>
            </div>

            <div class="actions">
              <app-button variant="secondary" type="button" (click)="cancel()">Cancelar</app-button>
              <app-button variant="primary" type="submit" [loading]="saving()" [disabled]="form.invalid || saldoInsuficiente()">
                <span class="material-icons">send</span>
                Enviar moedas
              </app-button>
            </div>
          </form>
        </app-card>
      </div>
    </app-shell>
  `,
  styles: [`
    .balance-strip {
      display: flex; align-items: center; gap: var(--space-3);
      background: var(--color-brand-soft);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-4) var(--space-5);
      margin-bottom: var(--space-5);
    }
    .balance-strip .material-icons {
      color: var(--color-accent-hover);
      font-size: 28px !important;
    }
    .balance-strip__label { font-size: var(--text-xs); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .balance-strip__value { font-size: var(--text-xl); font-weight: 700; color: var(--color-brand); }

    .form { display: flex; flex-direction: column; gap: var(--space-5); }
    .preview {
      display: flex; align-items: flex-start; gap: var(--space-2);
      padding: var(--space-3) var(--space-4);
      background: var(--color-success-soft);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      color: var(--color-text);
    }
    .preview .material-icons-outlined { color: var(--color-success); font-size: 20px !important; }
    .actions {
      display: flex; justify-content: flex-end; gap: var(--space-3);
      padding-top: var(--space-3);
      border-top: 1px solid var(--color-border);
    }
  `]
})
export class DistribuirMoedasComponent implements OnInit {
  private fb = inject(FormBuilder);
  private professorService = inject(ProfessorService);
  private alunoService = inject(AlunoService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  protected professor = signal<ProfessorResponse | null>(null);
  protected alunos = signal<AlunoResponse[]>([]);
  protected saving = signal(false);

  protected form = this.fb.nonNullable.group({
    alunoId: [0, [Validators.required, Validators.min(1)]],
    quantidade: [0, [Validators.required, Validators.min(1)]],
    mensagem: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
  });

  protected invalid = (field: string) => {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl.touched);
  };
  protected maxQuantidade = computed(() => this.professor()?.saldoMoedas ?? 0);
  protected saldoInsuficiente = computed(() => {
    const q = this.form.controls.quantidade.value;
    return q > 0 && q > this.maxQuantidade();
  });
  protected quantidadeValida = computed(() => {
    const q = this.form.controls.quantidade.value;
    return q > 0 && q <= this.maxQuantidade();
  });
  protected saldoAposEnvio = computed(() => Math.max(0, this.maxQuantidade() - (this.form.controls.quantidade.value || 0)));

  ngOnInit(): void {
    this.professorService.getMe().subscribe({ next: (p) => this.professor.set(p) });
    this.alunoService.listar().subscribe({ next: (list) => this.alunos.set(list) });
  }

  cancel(): void {
    this.router.navigate(['/professor/painel']);
  }

  onSubmit(): void {
    if (this.form.invalid || this.saldoInsuficiente()) {
      this.form.markAllAsTouched();
      return;
    }
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.saving.set(true);
    const dto = this.form.getRawValue() as DistribuirMoedasRequest;

    this.professorService.distribuir(user.id, dto).subscribe({
      next: () => {
        this.saving.set(false);
        this.snack.open('Moedas enviadas com sucesso!', 'Fechar', { duration: 3500, panelClass: ['snackbar-success'] });
        this.router.navigate(['/professor/painel']);
      },
      error: (err) => {
        this.saving.set(false);
        const msg = err?.error?.mensagem ?? 'Erro ao enviar moedas.';
        this.snack.open(msg, 'Fechar', { duration: 4500, panelClass: ['snackbar-error'] });
      },
    });
  }
}
