import { Component, Inject } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { ColSize } from '../crz-grid/crz-grid.component';
import { ColDef, ColumnResizedEvent, GridOptions } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import writeXlsxFile from 'write-excel-file';

export interface ResultRow {
  tag: string;
  pohodaAmount: number;
  crzAmount: number;
  moreInPohoda?: number;
  moreInCrz?: number;
}

const HEADER_ROW = [
  {
    value: 'Tag',
    fontWeight: 'bold',
  },
  {
    value: 'Pohoda množství',
    fontWeight: 'bold',
  },
  {
    value: 'CRZ množství',
    fontWeight: 'bold',
  },
  {
    value: 'Navíc v Pohodě',
    fontWeight: 'bold',
  },
  {
    value: 'Navíc v CRZu',
    fontWeight: 'bold',
  },
];

@Component({
  selector: 'app-result-grid',
  standalone: true,
  imports: [
    AgGridModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose,
    MatIconModule,
    NgIf,
  ],
  templateUrl: './result-grid.component.html',
  styleUrl: './result-grid.component.scss',
})
export class ResultGridComponent {
  private resizeSubject: Subject<ColSize> = new Subject<ColSize>();

  saved = false;

  gridOptions: GridOptions = {
    rowClassRules: {
      errorRow: 'data.moreInPohoda > 0 || data.moreInCrz > 0',
    },

    // other grid options ...
  };

  colSizes = {
    tag: Number(localStorage.getItem('result-tag')) || 226,
    pohodaAmount: Number(localStorage.getItem('result-pohodaAmount')) || 150,
    crzAmount: Number(localStorage.getItem('result-crzAmount')) || 150,
    moreInPohoda: Number(localStorage.getItem('result-moreInPohoda')) || 150,
    moreInCrz: Number(localStorage.getItem('result-moreInCrz')) || 150,
  };

  colDefs: ColDef<ResultRow>[] = [
    {
      field: 'tag',
      headerName: 'Tag',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      suppressMenu: true,
      floatingFilterComponentParams: {
        suppressFilterButton: true,
      },
      width: this.colSizes.tag,
    },
    {
      field: 'pohodaAmount',
      headerName: 'Pohoda množství',
      width: this.colSizes.pohodaAmount,
    },
    {
      field: 'crzAmount',
      headerName: 'CRZ množství',
      width: this.colSizes.crzAmount,
    },
    {
      field: 'moreInPohoda',
      headerName: 'Navíc v Pohodě',
      width: this.colSizes.moreInPohoda,
      cellClassRules: {
        errorCell: params => params.value > 0,
      },
    },
    {
      field: 'moreInCrz',
      headerName: 'Navíc v CRZu',
      width: this.colSizes.moreInCrz,
      cellClassRules: {
        errorCell: params => params.value > 0,
      },
    },
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: ResultRow[]) {
    this.resizeSubject.pipe(debounceTime(500)).subscribe((colSize: ColSize) => {
      localStorage.setItem(colSize.field, colSize.width.toString());
    });
  }

  onColResized($event: ColumnResizedEvent<ResultRow>) {
    this.resizeSubject.next({
      width: $event.column.getActualWidth(),
      field: `result-${$event.column.getColDef().field}`,
    });
  }

  async onSaveClick() {
    const data = [
      HEADER_ROW,
      ...this.data.map(row => [
        {
          value: row.tag,
        },
        {
          value: row.pohodaAmount,
        },
        {
          value: row.crzAmount,
        },
        {
          value: row.moreInPohoda,
          backgroundColor: row.moreInPohoda > 0 ? '#f14c4c' : undefined,
          color: row.moreInPohoda > 0 ? '#ffff00' : undefined,
          fontWeight: row.moreInPohoda > 0 ? 'bold' : undefined
        },
        {
          value: row.moreInCrz,
          backgroundColor: row.moreInCrz > 0 ? '#f14c4c' : undefined,
          color: row.moreInCrz > 0 ? '#ffff00' : undefined,
          fontWeight: row.moreInCrz > 0 ? 'bold' : undefined,
        },
      ]),
    ];

    await writeXlsxFile(data as any, {
      columns: [{ width: 30 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }],
      fileName: `pohoda-crz-${new Date().toLocaleDateString()}.xlsx`,
    });

    this.saved = true;
  }
}
