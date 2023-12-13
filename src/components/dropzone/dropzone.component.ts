import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';

@Component({
  selector: 'app-dropzone',
  standalone: true,
  imports: [MatButtonModule, NgxFileDropModule],
  templateUrl: './dropzone.component.html',
  styleUrl: './dropzone.component.scss',
})
export class DropzoneComponent {
  @Input() label = '';

  @Output() fileChange = new EventEmitter<File>();

  public dropped(file: NgxFileDropEntry[]) {
    if (file[0].fileEntry.isFile) {
      const fileEntry = file[0].fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => this.fileChange.emit(file));
    }
  }
}
