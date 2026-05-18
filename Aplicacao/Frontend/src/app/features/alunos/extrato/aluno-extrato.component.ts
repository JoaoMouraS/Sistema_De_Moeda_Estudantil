import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Student, Transaction } from '../../../core/models/api-models';
import { BalanceCardComponent } from './components/balance-card.component';
import { ExtractFilterComponent, PeriodFilter, TypeFilter } from './components/extract-filter.component';
import { TransactionListComponent } from './components/transaction-list.component';

@Component({
  standalone: true,
  selector: 'app-aluno-extrato',
  imports: [
    CommonModule, 
    RouterLink,
    BalanceCardComponent,
    ExtractFilterComponent,
    TransactionListComponent
  ],
  template: `
    <div class="extrato-container">
      <header class="extrato-header">
        <a routerLink="/home" class="back-link" aria-label="Voltar para a página inicial">
          <i class='bx bx-arrow-back' aria-hidden="true"></i>
          Voltar
        </a>
        <div class="header-text">
          <p class="eyebrow">Área do Aluno</p>
          <h1>Extrato de Moedas</h1>
          <p class="subtitle">Acompanhe seu saldo e todas as movimentações de créditos e débitos.</p>
        </div>
      </header>

      <main class="extrato-content">
        <app-balance-card [saldo]="student().saldoMoedas"></app-balance-card>
        
        <app-extract-filter (filterChanged)="onFilterChanged($event)"></app-extract-filter>

        <h3 class="section-title">Histórico de Transações</h3>
        <app-transaction-list 
          [transactions]="filteredTransactions()" 
          [loading]="loading()">
        </app-transaction-list>
      </main>
    </div>
  `,
  styles: [`
    @import url('https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css');

    .extrato-container {
      min-height: 100vh;
      background-color: #f4f7f6;
      padding: 24px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .extrato-header {
      max-width: 800px;
      margin: 0 auto 24px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .header-text {
      display: grid;
      gap: 10px;
    }
    .eyebrow {
      margin: 0;
      font-size: 0.85rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #4f5d78;
    }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #1e3c72;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s;
      width: fit-content;
    }
    .back-link:hover {
      color: #1e3c72;
    }
    .extrato-header h1 {
      margin: 0;
      color: #111827;
      font-size: clamp(2rem, 2.5vw, 2.8rem);
    }
    .subtitle {
      margin: 0;
      color: #5f677a;
      max-width: 720px;
      line-height: 1.6;
    }
    .extrato-content {
      max-width: 800px;
      margin: 0 auto;
    }
    .section-title {
      font-size: 1.2rem;
      color: #444;
      margin: 32px 0 16px;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .extrato-container {
        padding: 16px;
      }
      .extrato-header h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class AlunoExtratoComponent implements OnInit {
  student = signal<Student>({
    id: 1,
    email: 'aluno.exemplo@escola.edu',
    cpf: '123.456.789-00',
    rg: 'MG-12.345.678',
    nome: 'Ana Silva',
    curso: 'Ciência da Computação',
    saldoMoedas: 1250,
    instituicaoId: 1,
    instituicaoNome: 'Instituto Federal',
  });

  loading = signal<boolean>(true);
  allTransactions = signal<Transaction[]>([]);
  filteredTransactions = signal<Transaction[]>([]);

  currentFilter = { period: 'all' as PeriodFilter, type: 'ALL' as TypeFilter };

  ngOnInit() {
    this.loadMockData();
  }

  loadMockData() {
    this.loading.set(true);
    
    // Simula tempo de resposta da API
    setTimeout(() => {
      const now = new Date();
      const mockData: Transaction[] = [
        {
          id: 1,
          dataHora: new Date(now.getTime() - 1000 * 60 * 60 * 2),
          descricao: 'Nota A em Matemática',
          tipo: 'CREDITO',
          valor: 100,
        },
        {
          id: 2,
          dataHora: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2),
          descricao: 'Resgate de ingresso pro Cinema',
          tipo: 'DEBITO',
          valor: 50,
        },
        {
          id: 3,
          dataHora: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5),
          descricao: 'Participação na Feira de Ciências',
          tipo: 'CREDITO',
          valor: 200,
        },
        {
          id: 4,
          dataHora: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10),
          descricao: 'Compra de livro na Cantina',
          tipo: 'DEBITO',
          valor: 80,
        },
        {
          id: 5,
          dataHora: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 40),
          descricao: 'Destaque do mês',
          tipo: 'CREDITO',
          valor: 500,
        },
      ];

      const balanceDelta = mockData.reduce((total, tx) => total + (tx.tipo === 'CREDITO' ? tx.valor : -tx.valor), 0);
      this.student.set({ ...this.student(), saldoMoedas: this.student().saldoMoedas + balanceDelta });

      this.allTransactions.set(mockData);
      this.applyFilters();
      this.loading.set(false);
    }, 1500);
  }

  onFilterChanged(filter: { period: PeriodFilter, type: TypeFilter }) {
    this.currentFilter = filter;
    this.applyFilters();
  }

  private applyFilters() {
    let filtered = [...this.allTransactions()];

    // Filtra por Tipo
    if (this.currentFilter.type !== 'ALL') {
      filtered = filtered.filter(tx => tx.tipo === this.currentFilter.type);
    }

    // Filtra por Período
    const now = new Date();
    if (this.currentFilter.period !== 'all') {
      const days = parseInt(this.currentFilter.period, 10);
      const limitDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
      filtered = filtered.filter(tx => {
        const txDate = tx.dataHora instanceof Date ? tx.dataHora : new Date(tx.dataHora);
        return txDate >= limitDate;
      });
    }

    this.filteredTransactions.set(filtered);
  }
}