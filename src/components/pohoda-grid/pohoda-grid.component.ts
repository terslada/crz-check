import { Component, Input } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { NgIf } from '@angular/common';
import { ColDef, ColumnResizedEvent } from 'ag-grid-community';
import { debounceTime, Subject } from "rxjs";
import { ColSize, CrzRow } from "../crz-grid/crz-grid.component";

export interface PohodaRow {
  code: string;
  name: string;
  text: string;
  stockState: number;
  division: string;
}

@Component({
  selector: 'app-pohoda-grid',
  standalone: true,
  imports: [AgGridModule, NgIf],
  templateUrl: './pohoda-grid.component.html',
  styleUrl: './pohoda-grid.component.scss',
})
export class PohodaGridComponent {
  private resizeSubject: Subject<ColSize> = new Subject<ColSize>();

  @Input() data: PohodaRow[];

  colSizes = {
    code: Number(localStorage.getItem('pohoda-code')) || 119,
    name: Number(localStorage.getItem('pohoda-name')) || 391,
    text: Number(localStorage.getItem('pohoda-text')) || 181,
    stockState: Number(localStorage.getItem('pohoda-stockState')) || 120,
    division: Number(localStorage.getItem('pohoda-division')) || 216,
  };

  colDefs: ColDef<PohodaRow>[] = [
    {
      field: 'code',
      headerName: 'Kód',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      suppressMenu: true,
      floatingFilterComponentParams: {
        suppressFilterButton: true,
      },
      width: this.colSizes.code,
    },
    {
      field: 'name',
      headerName: 'Název',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      suppressMenu: true,
      floatingFilterComponentParams: {
        suppressFilterButton: true,
      },
      width: this.colSizes.name,
    },
    {
      field: 'text',
      headerName: 'Text',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      suppressMenu: true,
      floatingFilterComponentParams: {
        suppressFilterButton: true,
      },
      width: this.colSizes.text,
    },
    {
      field: 'stockState',
      headerName: 'Stav skladu',
      filter: 'agNumberColumnFilter',
      floatingFilter: true,
      suppressMenu: true,
      floatingFilterComponentParams: {
        suppressFilterButton: true,
      },
      width: this.colSizes.stockState,
    },
    {
      field: 'division',
      headerName: 'Divize',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      suppressMenu: true,
      floatingFilterComponentParams: {
        suppressFilterButton: true,
      },
      width: this.colSizes.division,
    },
  ];

  constructor() {
    this.resizeSubject.pipe(debounceTime(500)).subscribe((colSize: ColSize) => {
      localStorage.setItem(colSize.field, colSize.width.toString());
    });
  }

  onColResized($event: ColumnResizedEvent<PohodaRow>) {
    this.resizeSubject.next({
      width: $event.column.getActualWidth(),
      field: `pohoda-${$event.column.getColDef().field}`,
    });
  }
}
