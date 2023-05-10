import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComplexNutrient, generateUUID } from 'src/common/models/fatfacts.model';

@Component({
  selector: 'app-complex-display',
  templateUrl: './complex-display.component.html',
  styleUrls: ['./complex-display.component.scss']
})
export class ComplexDisplayComponent {
  @Input()
  complex!: ComplexNutrient;

  @Input()
  width: number = 1;

  @Input()
  level: number = 0;

  identifier: string = generateUUID();

  @Input()
  defaultCollapsed: boolean = true;

  @Output()
  delete: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  edit: EventEmitter<number> = new EventEmitter<number>();

  onDelete(level: number | undefined = undefined): void {
    this.delete.emit(level || this.level);
    console.log('delete', level || this.level);
  }
  onEdit(level: number | undefined = undefined): void { 
    this.edit.emit(level || this.level);
    console.log('edit', level || this.level);
  }
}
