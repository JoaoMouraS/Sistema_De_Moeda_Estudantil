import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlunoService } from '../../core/services/aluno.service';
import { InstituicaoService } from '../../core/services/instituicao.service';
import { Instituicao, AlunoRequest } from '../../core/models/api-models';

@Component({
  standalone: true,
  selector: 'app-aluno-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  template: `
    <div class="host-wrapper">
      <div class="wrapper__area">
        
        <div class="forms__area">
          <form class="login__form" [formGroup]="form" (ngSubmit)="onSubmit()">
            <h1 class="form__title">{{ isEdit() ? 'Editar Aluno' : 'Cadastrar Aluno' }}</h1>
            
            <div class="form-grid">
              <div class="input__group" [class.formError]="form.get('nome')?.invalid && form.get('nome')?.touched">
                <label class="field">
                  <input type="text" formControlName="nome" placeholder="Nome Completo">
                </label>
                <span class="input__icon"><i class="bx bx-user"></i></span>
                <small class="input__error_message">Nome é obrigatório</small>
              </div>

              <div class="input__group" [class.formError]="form.get('email')?.invalid && form.get('email')?.touched">
                <label class="field">
                  <input type="email" formControlName="email" placeholder="Email">
                </label>
                <span class="input__icon"><i class="bx bx-envelope"></i></span>
                <small class="input__error_message">Email inválido</small>
              </div>

              <div class="input__group" [class.formError]="form.get('senha')?.invalid && form.get('senha')?.touched">
                <label class="field">
                  <input type="password" formControlName="senha" [placeholder]="isEdit() ? 'Senha (deixe vazio para manter)' : 'Senha'">
                </label>
                <span class="input__icon"><i class="bx bx-lock"></i></span>
                <small class="input__error_message">Senha deve ter no mínimo 6 caracteres</small>
              </div>

              <div class="input__group" [class.formError]="form.get('cpf')?.invalid && form.get('cpf')?.touched">
                <label class="field">
                  <input type="text" formControlName="cpf" placeholder="CPF (11 dígitos)" maxlength="11">
                </label>
                <span class="input__icon"><i class="bx bx-id-card"></i></span>
                <small class="input__error_message">CPF inválido</small>
              </div>

              <div class="input__group" [class.formError]="form.get('rg')?.invalid && form.get('rg')?.touched">
                <label class="field">
                  <input type="text" formControlName="rg" placeholder="RG">
                </label>
                <span class="input__icon"><i class="bx bx-badge"></i></span>
                <small class="input__error_message">RG é obrigatório</small>
              </div>

              <div class="input__group" [class.formError]="form.get('curso')?.invalid && form.get('curso')?.touched">
                <label class="field">
                  <select formControlName="curso" class="custom-select">
                    <option value="" disabled selected>Selecione seu Curso</option>
                    @for (c of cursos(); track c) {
                      <option [value]="c">{{ c }}</option>
                    }
                  </select>
                </label>
                <span class="input__icon"><i class="bx bxs-graduation"></i></span>
                <small class="input__error_message">Curso é obrigatório</small>
              </div>

              <div class="input__group span-2" [class.formError]="form.get('endereco')?.invalid && form.get('endereco')?.touched">
                <label class="field">
                  <input type="text" formControlName="endereco" placeholder="Endereço Completo">
                </label>
                <span class="input__icon"><i class="bx bx-map"></i></span>
              </div>

              <div class="input__group span-2" [class.formError]="form.get('instituicaoId')?.invalid && form.get('instituicaoId')?.touched">
                <label class="field">
                  <select formControlName="instituicaoId" class="custom-select">
                    <option value="0" disabled selected>Selecione sua Instituição</option>
                    @for (i of instituicoes(); track i.id) {
                      <option [value]="i.id">{{ i.nome }}</option>
                    }
                  </select>
                </label>
                <span class="input__icon"><i class="bx bxs-bank"></i></span>
                <small class="input__error_message">Selecione uma instituição</small>
              </div>
            </div>

            <div class="form-actions-row">
              <a routerLink="/login" class="back-link"><i class="bx bx-arrow-back"></i> Voltar</a>
              <button type="submit" class="submit-button inline-btn" [disabled]="form.invalid || saving()">
                {{ saving() ? 'Salvando...' : 'Salvar' }}
              </button>
            </div>
          </form> 
        </div>

        <div class="aside__area">
          <div class="login__aside-info">
            <h4>Perfil Aluno</h4>
            <img src="https://e.top4top.io/p_1945sidbp2.png" alt="Student">
            <p>Cadastre-se para ganhar moedas estudantis, participar de projetos e trocar por vantagens incríveis!</p>
          </div>
        </div>
        
      </div>
    </div>
  `,
  styles: [`
    @import url('https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css');

    .host-wrapper {
      min-height: 100vh;
      background-color: var(--bg-main);
      display: flex; justify-content: center; align-items: center; padding: 20px;
    }

    .wrapper__area {
      width: 100%; max-width: 1000px;
      background-color: var(--bg-card);
      box-shadow: 0 10px 40px rgba(0,0,0,0.4);
      border-radius: 12px; display: flex; flex-direction: row;
      overflow: hidden; min-height: 600px;
    }

    .forms__area { flex: 1.5; display: grid; place-items: center; padding: 40px; }
    
    .login__form { width: 100%; }

    .form__title {
      font-size: 1.8rem; font-weight: bold; text-transform: uppercase;
      margin-bottom: 25px; color: var(--text-dark); text-align: center;
    }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 20px; }
    .span-2 { grid-column: span 2; }

    .input__group { position: relative; width: 100%; margin: 10px 0; }
    .input__group .field { position: relative; width: 100%; display: block; overflow: hidden; }

    .input__group .field::after {
      content: ''; position: absolute; bottom: 0; left: 0; right: 0; width: 100%; height: 2px;
      background-color: var(--secondary); transform: translateX(-100%); transition: 0.3s;
    }
    .input__group .field:focus-within::after { transform: translateX(0); }

    .input__group input, .input__group select {
      outline: none; width: 100%; border: none; padding: 12px 10px 12px 40px; background: transparent;
      border-bottom: 2px solid var(--input-border); font-size: 14px; color: var(--text-dark);
    }
    
    .custom-select { appearance: none; cursor: pointer; background-color: transparent; }

    .formError .field input, .formError .field select { border-color: var(--error); }
    .input__group > span { position: absolute; font-size: 20px; color: var(--input-border); transition: 0.3s; }
    .input__group input:focus ~ span, .input__group select:focus ~ span { color: var(--secondary); }
    .input__group .input__icon { top: 10px; left: 10px; pointer-events: none; }

    .input__error_message {
      display: block; color: var(--error); margin: 4px 10px 0;
      opacity: 0; pointer-events: none; font-size: 11px;
    }
    .formError .input__error_message { opacity: 1; }

    .form-actions-row { display: flex; justify-content: space-between; align-items: center; margin-top: 25px; }
    
    .back-link {
      color: var(--input-border); font-size: 15px; text-decoration: none; display: flex; align-items: center; gap: 5px; transition: 0.3s;
    }
    .back-link:hover { color: var(--secondary); }

    .submit-button {
      background-color: var(--primary); color: var(--text-light);
      cursor: pointer; padding: 12px 30px; border: none; border-radius: 6px;
      font-size: 15px; font-weight: 600; text-transform: uppercase; transition: 0.3s;
    }
    .submit-button:disabled { background-color: #ccc; cursor: not-allowed; }
    .submit-button:hover:not(:disabled) { background-color: var(--primary-hover); transform: translateY(-2px); }

    /* Aside Area (Alterado para var(--secondary)) */
    .aside__area {
      flex: 1; background-color: var(--secondary);
      display: grid; place-items: center; padding: 40px 20px;
    }
    .aside__area > div { display: flex; flex-direction: column; align-items: center; text-align: center; }
    .aside__area h4 { color: var(--text-light); letter-spacing: 1px; font-size: 24px; margin-bottom: 20px; }
    .aside__area img { width: 80%; max-width: 200px; margin-bottom: 20px; }
    .aside__area p { color: var(--text-light); font-size: 14px; line-height: 1.5; }

    @media (max-width: 768px) {
      .wrapper__area { flex-direction: column; max-width: 450px; }
      .aside__area { order: -1; padding: 30px 20px; }
      .aside__area img { display: none; }
      .form-grid { grid-template-columns: 1fr; }
      .span-2 { grid-column: span 1; }
      .forms__area { padding: 30px 20px; }
      .form-actions-row { flex-direction: column-reverse; gap: 20px; }
      .submit-button { width: 100%; }
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

  instituicoes = signal<Instituicao[]>([]);
  saving = signal(false);
  alunoId = signal<number | null>(null);
  isEdit = () => this.alunoId() !== null;

  // Lista reativa contendo cerca de 30 cursos representativos
  cursos = signal<string[]>([
    'Administração', 'Análise e Desenvolvimento de Sistemas', 'Arquitetura e Urbanismo',
    'Biomedicina', 'Ciência da Computação', 'Ciências Biológicas', 'Ciências Contábeis',
    'Ciências Econômicas', 'Design Gráfico', 'Direito', 'Enfermagem', 'Engenharia Civil',
    'Engenharia de Computação', 'Engenharia de Produção', 'Engenharia de Software',
    'Engenharia Elétrica', 'Engenharia Mecânica', 'Engenharia Química', 'Farmácia',
    'Fisioterapia', 'História', 'Jornalismo', 'Letras', 'Medicina', 'Medicina Veterinária',
    'Nutrição', 'Odontologia', 'Pedagogia', 'Psicologia', 'Publicidade e Propaganda',
    'Sistemas de Informação'
  ]);

  form = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.minLength(6)]],
    cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
    rg: ['', Validators.required],
    curso: ['', Validators.required], // Mantido o validador original
    endereco: [''],
    instituicaoId: [0, Validators.required],
  });

  ngOnInit(): void {
    this.instituicaoService.listar().subscribe((list) => this.instituicoes.set(list));

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.alunoId.set(Number(id));
      this.form.controls.senha.clearValidators();
      this.form.controls.senha.updateValueAndValidity();
      this.alunoService.buscar(Number(id)).subscribe({
        next: (a) => {
          this.form.patchValue({
            nome: a.nome,
            email: a.email,
            cpf: a.cpf,
            rg: a.rg,
            curso: a.curso,
            endereco: a.endereco ?? '',
            instituicaoId: a.instituicaoId,
            senha: '',
          });
        },
        error: () => this.snack.open('Aluno não encontrado.', 'Fechar', { duration: 4000 }),
      });
    } else {
      this.form.controls.senha.addValidators([Validators.required, Validators.minLength(6)]);
    }
  }

  onSubmit() {
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
        this.snack.open(this.isEdit() ? 'Aluno atualizado.' : 'Aluno cadastrado.', 'Fechar', { duration: 3000 });
        this.router.navigate([this.isEdit() ? '/alunos' : '/login']);
      },
      error: (err) => {
        this.saving.set(false);
        const msg = err?.error?.mensagem ?? 'Erro ao salvar aluno.';
        this.snack.open(msg, 'Fechar', { duration: 4000 });
      },
    });
  }
}