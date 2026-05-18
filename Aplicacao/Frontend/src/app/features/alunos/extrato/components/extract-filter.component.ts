import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

export type PeriodFilter = '7' | '30' | 'all';
export type TypeFilter = 'ALL' | 'CREDITO' | 'DEBITO';

@Component({
  standalone: true,
  selector: 'app-extract-filter',
  imports: [CommonModule, MatButtonToggleModule, MatSelectModule, MatFormFieldModule],
  template: `
    <div class="filter-container">
      <div class="filter-group">
        <label>Período:</label>
        <mat-button-toggle-group [value]="selectedPeriod" (change)="onPeriodChange($event.value)" aria-label="Selecione o período">
          <mat-button-toggle value="7">Últimos 7 dias</mat-button-toggle>
          <mat-button-toggle value="30">Últimos 30 dias</mat-button-toggle>
          <mat-button-toggle value="all">Todos</mat-button-toggle>
        </mat-button-toggle-group>
      </div>

      <div class="filter-group">
        <mat-form-field appearance="outline">
          <mat-label>Tipo de Transação</mat-label>
          <mat-select [value]="selectedType" (selectionChange)="onTypeChange($event.value)">
            <mat-option value="ALL">Todas</mat-option>
            <mat-option value="CREDITO">Entradas (Créditos)</mat-option>
            <mat-option value="DEBITO">Saídas (Débitos)</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </div>
  `,
  styles: [`
    .filter-container {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      align-items: center;
      margin-bottom: 24px;
      padding: 16px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .filter-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .filter-group label {
      font-weight: 500;
      color: #555;
    }
    mat-form-field {
      width: 200px;
    }
    ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }
  `]
})
export class ExtractFilterComponent {
  selectedPeriod: PeriodFilter = 'all';
  selectedType: TypeFilter = 'ALL';

  @Output() filterChanged = new EventEmitter<{ period: PeriodFilter, type: TypeFilter }>();

  onPeriodChange(period: PeriodFilter) {
    this.selectedPeriod = period;
    this.emitChange();
  }

  onTypeChange(type: TypeFilter) {
    this.selectedType = type;
    this.emitChange();
  }

  private emitChange() {
    this.filterChanged.emit({ period: this.selectedPeriod, type: this.selectedType });
  }
}