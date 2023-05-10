import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Focusable } from '../app.component';

@Component({
  selector: 'app-fact-inspect',
  templateUrl: './fact-inspect.component.html',
  styleUrls: ['./fact-inspect.component.scss']
})
export class FactInspectComponent {
  @Input()
  focusedData: Focusable | undefined;

  @Output()
  edit = new EventEmitter<[number, number]>();

  @Output()
  delete = new EventEmitter<[number, number]>();

  constructor() { }


  onEdit(item: number, level: number) {
    this.edit.emit([item, level]);
    console.log('edit', item, level);
  }

  onDelete(item: number, level: number) {
    this.delete.emit([item, level]);
    console.log('delete', item, level);
  }
}
