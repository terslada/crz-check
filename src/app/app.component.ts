import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MatButtonModule } from '@angular/material/button';
import { AgGridModule } from 'ag-grid-angular';
import { DropzoneComponent } from '../components/dropzone/dropzone.component';
import { CrzGridComponent, CrzRow } from '../components/crz-grid/crz-grid.component';
import { PohodaGridComponent, PohodaRow } from '../components/pohoda-grid/pohoda-grid.component';
import readXlsxFile from 'read-excel-file';
import { AngularSplitModule, IAreaSize, IOutputData } from 'angular-split';
import { MatDialog } from '@angular/material/dialog';
import { ResultGridComponent, ResultRow } from '../components/result-grid/result-grid.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NgxFileDropModule,
    MatButtonModule,
    AgGridModule,
    DropzoneComponent,
    CrzGridComponent,
    PohodaGridComponent,
    AngularSplitModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  pohodaRowData: PohodaRow[];
  crzRowData: CrzRow[];
  crzSize: IAreaSize;
  pohodaSize: IAreaSize;

  dialog = inject(MatDialog);

  constructor(private matSnackBar: MatSnackBar) {
    this.pohodaSize = (localStorage.getItem('pohodaSize') as IAreaSize) ?? ('60' as IAreaSize);
    this.crzSize = (localStorage.getItem('crzSize') as IAreaSize) ?? ('40' as IAreaSize);
  }

  onPohodaFileUploaded(file: File) {
    const header = ['Kód', 'Název', 'Text', 'Stav zásoby', 'Členění'];

    console.log(file);
    readXlsxFile(file).then(rows => {
      console.log(rows);
      const headerRow = rows[1];
      const headerRowMatches = headerRow.every((cell, index) => cell === header[index]);

      if (!headerRowMatches) {
        this.matSnackBar.open(
          `Taťulo beztak tu strkáš špatný soubor! - Chceš do pohody nahrát '${file.name}' (pokud je to správný soubor, asi se změnila struktura a musíš mi dát vědět)`,
          'Zavřít',
          {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: 'error-snackbar',
          },
        );

        return;
      }

      this.pohodaRowData = rows.slice(2).map(row => {
        return {
          code: row[0]?.toString(),
          name: row[1]?.toString(),
          text: row[2]?.toString(),
          stockState: Number(row[3]?.toString()),
          division: row[4]?.toString(),
        };
      });

      console.log(this.pohodaRowData);
    });
  }

  onCrzFileUploaded(file: File) {
    const header = ['Název', 'Ráže / typ munice', 'Množství', 'Jednotky'];

    console.log(file);
    readXlsxFile(file).then(rows => {
      console.log(rows);
      const headerRow = rows[0];
      const headerRowMatches = headerRow.every((cell, index) => cell === header[index]);

      if (!headerRowMatches) {
        this.matSnackBar.open(
          `Taťulo beztak tu strkáš špatný soubor! - Chceš do CRZu nahrát '${file.name}' (pokud je to správný soubor, asi se změnila struktura a musíš mi dát vědět)`,
          'Zavřít',
          {
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: 'error-snackbar',
          },
        );

        return;
      }

      this.crzRowData = rows.slice(1).map(row => ({
        name: row[0]?.toString(),
        caliber: row[1]?.toString(),
        amount: Number(row[2]?.toString()),
        unit: row[3]?.toString(),
      }));

      console.log(this.pohodaRowData);
    });
  }

  onResizeEnded($event: IOutputData) {
    console.log($event);

    localStorage.setItem('pohodaSize', $event.sizes[0].toString());
    localStorage.setItem('crzSize', $event.sizes[1].toString());
  }

  onCalculateClick() {
    const data = this._calculate();
    let dialogRef = this.dialog.open(ResultGridComponent, {
      data: data,
      height: '95vh',
      width: '900px',
      disableClose: true,
    });
  }

  onPohodaCloseClick() {
    this.pohodaRowData = null;
  }

  onCrzCloseClick() {
    this.crzRowData = null;
  }

  private _calculate() {
    const allPohodaTags = [...new Set(this.pohodaRowData.map(row => this._getTagFromText(row.text)))];
    const allCrzTags = [
      ...new Set(this.crzRowData.filter(row => row.caliber).map(row => this._getTagFromText(row.caliber))),
    ];
    const allTags = [...new Set([...allPohodaTags, ...allCrzTags])];

    const result = allTags.map<ResultRow>(tag => {
      const pohodaAmount = this._getPohodaAmountForTag(tag, this.pohodaRowData);
      const crzAmount = this._getCrzAmountForTag(tag, this.crzRowData);

      return {
        tag,
        pohodaAmount,
        crzAmount,
        moreInPohoda: pohodaAmount - crzAmount > 0 ? pohodaAmount - crzAmount : undefined,
        moreInCrz: crzAmount - pohodaAmount > 0 ? crzAmount - pohodaAmount : undefined,
      };
    });

    console.log(result);

    console.log(allPohodaTags, allCrzTags);
    return result;
  }

  private _getPohodaAmountForTag(tag: string, data: PohodaRow[]) {
    const rows = data.filter(row => this._getTagFromText(row.text) === tag);

    if (rows.length === 0) {
      return 0;
    }

    return rows.reduce((acc, row) => acc + row.stockState, 0);
  }

  private _getCrzAmountForTag(tag: string, data: CrzRow[]) {
    const rows = data.filter(row => row.caliber).filter(row => this._getTagFromText(row.caliber) === tag);

    if (rows.length === 0) {
      return 0;
    }

    return rows.reduce((acc, row) => acc + row.amount, 0);
  }

  private _getTagFromText(inputText: string) {
    // Use a regular expression to match "CRZ:" followed by optional whitespace
    const regex = /CRZ:\s*/g;

    // Remove "CRZ:" and all whitespace from the input text
    const result = inputText.replace(regex, '').replace(/\s/g, '');

    return result;
  }
}
