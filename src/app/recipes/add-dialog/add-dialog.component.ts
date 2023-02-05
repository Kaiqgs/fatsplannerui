import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss'],
})
export class AddDialogComponent {
  constructor(private _dialog: MatDialogRef<AddDialogComponent>) {}

  @ViewChild('name')
  nameInput!: ElementRef<HTMLInputElement>;

  add() {
    this._dialog.close(this.nameInput.nativeElement.value);
  }

  cancel() {
    this._dialog.close(null);
  }
}
