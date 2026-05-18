import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InstituicaoService } from '../../core/services/instituicao.service';
import { Instituicao } from '../../core/models/api-models';

@Component({
  standalone: true,
  selector: 'app-vantagem-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="host-wrapper">
      <div class="wrapper__area">
        
        <div class="forms__area" style="flex: 2;">
          <form class="login__form" [formGroup]="form" (ngSubmit)="onSubmit()">
            <h1 class="form__title">Criar Nova Vantagem</h1>
            <p class="subtitle">Ofereça produtos e descontos para atrair os melhores alunos!</p>
            
            <div class="form-grid">
              
              <div class="input__group span-2" [class.formError]="form.get('titulo')?.invalid && form.get('titulo')?.touched">
                <label class="field">
                  <input type="text" formControlName="titulo" placeholder="Ex: 50% Off no Combo Burger">
                </label>
                <span class="input__icon"><i class="bx bx-purchase-tag-alt"></i></span>
                <small class="input__error_message">Título obrigatório</small>
              </div>

              <div class="input__group" [class.formError]="form.get('custoMoedas')?.invalid && form.get('custoMoedas')?.touched">
                <label class="field">
                  <input type="number" formControlName="custoMoedas" placeholder="Preço em Student Coins (Ex: 100)">
                </label>
                <span class="input__icon"><i class="bx bx-coin-stack"></i></span>
                <small class="input__error_message">Valor inválido</small>
              </div>

              <div class="input__group" [class.formError]="form.get('quantidade')?.invalid && form.get('quantidade')?.touched">
                <label class="field">
                  <input type="number" formControlName="quantidade" placeholder="Limite de Cupons (Ex: 50)">
                </label>
                <span class="input__icon"><i class="bx bx-layer"></i></span>
              </div>

              <div class="input__group" [class.formError]="form.get('cupom')?.invalid && form.get('cupom')?.touched">
                <label class="field">
                  <input type="text" formControlName="cupom" placeholder="Código Secreto (Ex: PROMO50)">
                </label>
                <span class="input__icon"><i class="bx bx-barcode-reader"></i></span>
                <small class="input__error_message">Cupom obrigatório</small>
              </div>

              <div class="input__group" [class.formError]="form.get('validade')?.invalid && form.get('validade')?.touched">
                <label class="field">
                  <input type="date" formControlName="validade" title="Data de Validade">
                </label>
                <span class="input__icon"><i class="bx bx-calendar"></i></span>
              </div>

              <div class="input__group span-2" [class.formError]="form.get('instituicaoId')?.invalid && form.get('instituicaoId')?.touched">
                <label class="field">
                  <select formControlName="instituicaoId" class="custom-select">
                    <option value="0" disabled selected>Disponível para qual Instituição?</option>
                    <option value="ALL">Todas as Instituições</option>
                    @for (i of instituicoes(); track i.id) {
                      <option [value]="i.id">{{ i.nome }}</option>
                    }
                  </select>
                </label>
                <span class="input__icon"><i class="bx bxs-bank"></i></span>
              </div>

              <div class="input__group span-2" [class.formError]="form.get('descricao')?.invalid && form.get('descricao')?.touched">
                <label class="field">
                  <textarea formControlName="descricao" placeholder="Descreva as regras da vantagem..." rows="3"></textarea>
                </label>
                <span class="input__icon"><i class="bx bx-align-left"></i></span>
              </div>

            </div>

            <div class="form-actions-row">
              <a routerLink="/home" class="back-link"><i class="bx bx-arrow-back"></i> Voltar ao Painel</a>
              <button type="submit" class="submit-button btn-empresa" [disabled]="form.invalid || saving()">
                {{ saving() ? 'Publicando...' : 'Publicar Vantagem' }}
              </button>
            </div>
          </form> 
        </div>

        <div class="aside__area">
          <div class="login__aside-info">
            <h4>Atraia Talentos!</h4>
            <img src="https://d.top4top.io/p_1945xjz2y1.png" alt="Company">
            <p>Ao criar vantagens exclusivas, você incentiva a educação e traz os melhores alunos para o seu negócio.</p>
          </div>
        </div>
        
      </div>
    </div>
  `,
  styles: [`
    @import url('https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css');

    .host-wrapper {
      min-height: 100vh; background-color: var(--bg-main);
      display: flex; justify-content: center; align-items: center; padding: 20px;
    }

    .wrapper__area {
      width: 100%; max-width: 950px;
      background-color: var(--bg-card); box-shadow: 0 10px 40px rgba(0,0,0,0.4);
      border-radius: 12px; display: flex; flex-direction: row;
      overflow: hidden; min-height: 550px;
    }

    .forms__area { display: grid; place-items: center; padding: 40px; }
    
    .login__form { width: 100%; }

    .form__title {
      font-size: 1.8rem; font-weight: bold; text-transform: uppercase;
      margin-bottom: 5px; color: var(--text-dark); text-align: center;
    }

    .subtitle { text-align: center; color: #666; margin-bottom: 25px; font-size: 14px; }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 20px; }
    .span-2 { grid-column: span 2; }

    .input__group { position: relative; width: 100%; margin: 10px 0; }
    .input__group .field { position: relative; width: 100%; display: block; overflow: hidden; }

    .input__group .field::after {
      content: ''; position: absolute; bottom: 0; left: 0; right: 0; width: 100%; height: 2px;
      background-color: var(--secondary); transform: translateX(-100%); transition: 0.3s;
    }
    .input__group .field:focus-within::after { transform: translateX(0); }

    .input__group input, .input__group select, .input__group textarea {
      outline: none; width: 100%; border: none; padding: 12px 10px 12px 40px; background: transparent;
      border-bottom: 2px solid var(--input-border); font-size: 14px; color: var(--text-dark);
    }
    
    textarea { resize: none; }
    .custom-select { appearance: none; cursor: pointer; }

    .formError .field input, .formError .field select, .formError .field textarea { border-color: var(--error); }
    .input__group > span { position: absolute; font-size: 20px; color: var(--input-border); transition: 0.3s; }
    .input__group input:focus ~ span, .input__group select:focus ~ span, .input__group textarea:focus ~ span { color: var(--secondary); }
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
      color: var(--text-light); cursor: pointer; padding: 12px 30px; border: none; border-radius: 6px;
      font-size: 15px; font-weight: 600; text-transform: uppercase; transition: 0.3s;
    }
    .submit-button:disabled { background-color: #ccc; cursor: not-allowed; }
    
    .btn-empresa { background-color: var(--secondary); }
    .btn-empresa:hover:not(:disabled) { background-color: var(--secondary-hover); transform: translateY(-2px); }

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
export class VantagemFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private instituicaoService = inject(InstituicaoService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  instituicoes = signal<Instituicao[]>([]);
  saving = signal(false);

  form = this.fb.nonNullable.group({
    titulo: ['', Validators.required],
    descricao: ['', Validators.required],
    custoMoedas: [0, [Validators.required, Validators.min(1)]],
    quantidade: [null], 
    cupom: ['', Validators.required],
    validade: ['', Validators.required],
    instituicaoId: ['ALL', Validators.required],
  });

  ngOnInit(): void {
    this.instituicaoService.listar().subscribe((list) => this.instituicoes.set(list));
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.saving.set(true);
    
    setTimeout(() => { 
      this.saving.set(false);
      this.snack.open('Vantagem publicada com sucesso!', 'Fechar', { duration: 3000 });
      this.router.navigate(['/home']);
    }, 1500);
  }
}