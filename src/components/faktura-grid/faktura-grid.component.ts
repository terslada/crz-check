import { Component, Input } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { NgIf } from '@angular/common';
import { ColDef, ColumnResizedEvent } from 'ag-grid-community';
import { debounceTime, Subject } from 'rxjs';
import { ColSize, CrzRow } from '../crz-grid/crz-grid.component';

export interface FakturaRow {
  name: string;
  quantity: number;
}

@Component({
  selector: 'app-faktura-grid',
  standalone: true,
  imports: [AgGridModule],
  templateUrl: './faktura-grid.component.html',
  styleUrl: './faktura-grid.component.scss',
})
export class FakturaGridComponent {
  @Input() data: FakturaRow[];

  doneNames: string[] = [];

  colDefs: ColDef<FakturaRow>[] = [
    {
      field: 'name',
      headerName: 'Název',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      suppressMenu: true,
      sort: 'asc',
      floatingFilterComponentParams: {
        suppressFilterButton: true,
      },
      flex: 1,
      resizable: false,
      cellStyle: params => {
        if (this.doneNames.includes(params.data.name)) {
          return { textDecoration: 'line-through', color: 'gray' };
        }
        return {};
      },
      onCellDoubleClicked: this.onCellDoubleClick.bind(this)
    },
    {
      field: 'quantity',
      headerName: 'Počet',
      filter: 'agNumberColumnFilter',
      floatingFilter: true,
      suppressMenu: true,
      floatingFilterComponentParams: {
        suppressFilterButton: true,
      },
      width: 150,
      resizable: false,
      onCellDoubleClicked: this.onCellDoubleClick.bind(this),
      cellStyle: params => {
        if (this.doneNames.includes(params.data.name)) {
          return { textDecoration: 'line-through', color: 'gray' };
        }
        return {};
      },
    },
  ];

  onCellDoubleClick(event: any) {
    const name = event.data.name;
    if (this.doneNames.includes(name)) {
      this.doneNames = this.doneNames.filter(n => n !== name);
    } else {
      this.doneNames.push(name);
    }
    event.api.refreshCells({ force: true });
  }
}
