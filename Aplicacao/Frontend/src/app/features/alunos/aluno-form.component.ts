import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlunoService } from '../../core/services/aluno.service';
import { InstituicaoService } from '../../core/services/instituicao.service';
import { Instituicao, AlunoRequest } from '../../core/models/api-models';
import { AppShellComponent } from '../../shared/components/app-shell.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { CardComponent } from '../../shared/components/card.component';
import { ButtonComponent } from '../../shared/components/button.component';
import { FormFieldComponent } from '../../shared/components/form-field.component';

const CURSOS = [
  'Administração', 'Análise e Desenvolvimento de Sistemas', 'Arquitetura e Urbanismo',
  'Biomedicina', 'Ciência da Computação', 'Ciências Biológicas', 'Ciências Contábeis',
  'Ciências Econômicas', 'Design Gráfico', 'Direito', 'Enfermagem', 'Engenharia Civil',
  'Engenharia de Computação', 'Engenharia de Produção', 'Engenharia de Software',
  'Engenharia Elétrica', 'Engenharia Mecânica', 'Engenharia Química', 'Farmácia',
  'Fisioterapia', 'História', 'Jornalismo', 'Letras', 'Medicina', 'Medicina Veterinária',
  'Nutrição', 'Odontologia', 'Pedagogia', 'Psicologia', 'Publicidade e Propaganda',
  'Sistemas de Informação',
];

@Component({
  standalone: true,
  selector: 'app-aluno-form',
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
          [title]="isEdit() ? 'Editar aluno' : 'Cadastrar aluno'"
          [subtitle]="isEdit() ? 'Atualize os dados do aluno.' : 'Cadastre-se para participar do programa de mérito.'"
          [backTo]="isEdit() ? '/alunos' : '/login'"
        ></app-page-header>

        <app-card>
          <form class="form" [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
            <div class="grid">
              <app-form-field
                label="Nome completo"
                [required]="true"
                [hasError]="invalid('nome')"
                error="Nome é obrigatório"
              >
                <input type="text" formControlName="nome" placeholder="Ex.: Ana Silva">
              </app-form-field>

              <app-form-field
                label="E-mail"
                [required]="true"
                [hasError]="invalid('email')"
                error="Informe um e-mail válido"
              >
                <input type="email" formControlName="email" placeholder="voce@exemplo.com" autocomplete="email">
              </app-form-field>

              <app-form-field
                label="CPF"
                [required]="true"
                [hint]="'Apenas dígitos, 11 caracteres'"
                [hasError]="invalid('cpf')"
                error="CPF deve ter 11 dígitos numéricos"
              >
                <input type="text" formControlName="cpf" placeholder="00000000000" maxlength="11" inputmode="numeric">
              </app-form-field>

              <app-form-field
                label="RG"
                [required]="true"
                [hasError]="invalid('rg')"
                error="RG é obrigatório"
              >
                <input type="text" formControlName="rg" placeholder="MG-00.000.000">
              </app-form-field>

              <app-form-field
                label="Curso"
                [required]="true"
                [hasError]="invalid('curso')"
                error="Selecione um curso"
              >
                <select formControlName="curso">
                  <option value="" disabled>Selecione o curso</option>
                  @for (c of cursos; track c) {
                    <option [value]="c">{{ c }}</option>
                  }
                </select>
              </app-form-field>

              <app-form-field
                label="Instituição"
                [required]="true"
                [hasError]="invalid('instituicaoId')"
                error="Selecione uma instituição"
              >
                <select formControlName="instituicaoId">
                  <option [ngValue]="0" disabled>Selecione a instituição</option>
                  @for (i of instituicoes(); track i.id) {
                    <option [ngValue]="i.id">{{ i.nome }}</option>
                  }
                </select>
              </app-form-field>

              <app-form-field
                class="span-2"
                label="Endereço"
                hint="Opcional"
              >
                <input type="text" formControlName="endereco" placeholder="Rua, número, bairro, cidade/UF">
              </app-form-field>

              <app-form-field
                class="span-2"
                label="Senha"
                [required]="!isEdit()"
                [hint]="isEdit() ? 'Deixe em branco para manter a senha atual' : 'Mínimo 6 caracteres'"
                [hasError]="invalid('senha')"
                error="A senha deve ter no mínimo 6 caracteres"
              >
                <input type="password" formControlName="senha" [placeholder]="isEdit() ? '••••••••' : 'Pelo menos 6 caracteres'" autocomplete="new-password">
              </app-form-field>
            </div>

            <div class="actions">
              <app-button variant="secondary" type="button" (click)="cancel()">Cancelar</app-button>
              <app-button variant="primary" type="submit" [loading]="saving()" [disabled]="form.invalid">
                {{ isEdit() ? 'Salvar alterações' : 'Cadastrar' }}
              </app-button>
            </div>
          </form>
        </app-card>
      </div>
    </app-shell>
  `,
  styles: [`
    .form { display: flex; flex-direction: column; gap: var(--space-6); }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4) var(--space-5);
    }
    .span-2 { grid-column: span 2; }
    .actions {
      display: flex; justify-content: flex-end; gap: var(--space-3);
      padding-top: var(--space-4);
      border-top: 1px solid var(--color-border);
    }
    @media (max-width: 640px) {
      .grid { grid-template-columns: 1fr; }
      .span-2 { grid-column: span 1; }
      .actions { flex-direction: column-reverse; }
      .actions app-button { display: block; }
    }
  `]
})
export class AlunoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private alunoService = inject(AlunoService);
  private instituicaoService = inject(InstituicaoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  protected cursos = CURSOS;
  protected instituicoes = signal<Instituicao[]>([]);
  protected saving = signal(false);
  protected alunoId = signal<number | null>(null);

  protected isEdit = () => this.alunoId() !== null;
  protected invalid = (field: string) => {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl.touched);
  };

  protected form = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    senha: [''],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    rg: ['', Validators.required],
    curso: ['', Validators.required],
    endereco: [''],
    instituicaoId: [0, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.instituicaoService.listar().subscribe((list) => this.instituicoes.set(list));

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.alunoId.set(Number(id));
      this.form.controls.senha.clearValidators();
      this.form.controls.senha.updateValueAndValidity();
      this.alunoService.buscar(Number(id)).subscribe({
        next: (a) => this.form.patchValue({
          nome: a.nome,
          email: a.email,
          cpf: a.cpf,
          rg: a.rg,
          curso: a.curso,
          endereco: a.endereco ?? '',
          instituicaoId: a.instituicaoId,
          senha: '',
        }),
        error: () => this.snack.open('Aluno não encontrado.', 'Fechar', { duration: 4000 }),
      });
    } else {
      this.form.controls.senha.addValidators([Validators.required, Validators.minLength(6)]);
      this.form.controls.senha.updateValueAndValidity();
    }
  }

  cancel(): void {
    this.router.navigate([this.isEdit() ? '/alunos' : '/login']);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const dto = this.form.getRawValue() as AlunoRequest;
    const obs = this.isEdit()
      ? this.alunoService.atualizar(this.alunoId()!, dto)
      : this.alunoService.cadastrar(dto);

    obs.subscribe({
      next: () => {
        this.saving.set(false);
        this.snack.open(this.isEdit() ? 'Aluno atualizado.' : 'Cadastro concluído. Faça login.', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });
        this.router.navigate([this.isEdit() ? '/alunos' : '/login']);
      },
      error: (err) => {
        this.saving.set(false);
        const msg = err?.error?.mensagem ?? err?.error?.camposInvalidos
          ? this.formatErrors(err.error)
          : 'Erro ao salvar aluno.';
        this.snack.open(msg, 'Fechar', { duration: 4500, panelClass: ['snackbar-error'] });
      },
    });
  }

  private formatErrors(body: any): string {
    if (body?.mensagem) return body.mensagem;
    if (body?.camposInvalidos) {
      return Object.entries(body.camposInvalidos).map(([k, v]) => `${k}: ${v}`).join(' · ');
    }
    return 'Erro de validação.';
  }
}
