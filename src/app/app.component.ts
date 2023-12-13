import { Component } from '@angular/core';
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
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  pohodaRowData: PohodaRow[];
  crzRowData: CrzRow[];
  crzSize: IAreaSize;
  pohodaSize: IAreaSize;

  constructor() {
    this.pohodaSize = localStorage.getItem('pohodaSize') as IAreaSize ?? '60' as IAreaSize;
    this.crzSize = localStorage.getItem('crzSize') as IAreaSize ?? '40' as IAreaSize;
  }

  onPohodaFileUploaded(file: File) {
    console.log(file);
    readXlsxFile(file).then(rows => {
      console.log(rows);
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
    console.log(file);
    readXlsxFile(file).then(rows => {
      console.log(rows);
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
}
