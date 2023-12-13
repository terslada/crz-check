import { Component, Input } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, ColumnResizedEvent } from 'ag-grid-community';
import { debounceTime, Subject } from 'rxjs';

export interface CrzRow {
  name: string;
  caliber: string;
  amount: number;
  unit: string;
}

export interface ColSize {
  width: number;
  field: string;
}

@Component({
  selector: 'app-crz-grid',
  standalone: true,
  imports: [AgGridModule],
  templateUrl: './crz-grid.component.html',
  styleUrl: './crz-grid.component.scss',
})
export class CrzGridComponent {
  private resizeSubject: Subject<ColSize> = new Subject<ColSize>();

  @Input() data: CrzRow[];

  colSizes = {
    name: Number(localStorage.getItem('crz-name')) || 190,
    caliber: Number(localStorage.getItem('crz-caliber')) || 254,
    amount: Number(localStorage.getItem('crz-amount')) || 113,
    unit: Number(localStorage.getItem('crz-unit')) || 100,
  };

  colDefs: ColDef<CrzRow>[] = [
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
      field: 'caliber',
      headerName: 'Ráže / typ munice',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      suppressMenu: true,
      floatingFilterComponentParams: {
        suppressFilterButton: true,
      },
      width: this.colSizes.caliber,
    },
    {
      field: 'amount',
      headerName: 'Množství',
      filter: 'agNumberColumnFilter',
      floatingFilter: true,
      suppressMenu: true,
      floatingFilterComponentParams: {
        suppressFilterButton: true,
      },
      width: this.colSizes.amount,
    },
    {
      field: 'unit',
      headerName: 'Jednotky',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      suppressMenu: true,
      floatingFilterComponentParams: {
        suppressFilterButton: true,
      },
      width: this.colSizes.unit,
    },
  ];

  constructor() {
    this.resizeSubject.pipe(debounceTime(500)).subscribe((colSize: ColSize) => {
      localStorage.setItem(colSize.field, colSize.width.toString());
    });
  }

  onColResized($event: ColumnResizedEvent<CrzRow>) {
    this.resizeSubject.next({
      width: $event.column.getActualWidth(),
      field: `crz-${$event.column.getColDef().field}`,
    });
  }
}
