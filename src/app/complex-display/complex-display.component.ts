import { Component, Input } from '@angular/core';
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


}
