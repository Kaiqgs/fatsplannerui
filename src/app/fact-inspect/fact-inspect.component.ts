import { Component, Input } from '@angular/core';
import { ComplexNutrient, computeComplexMacro, emptyNutrient } from 'src/common/models/fatfacts.model';
import { Focusable } from '../app.component';

@Component({
  selector: 'app-fact-inspect',
  templateUrl: './fact-inspect.component.html',
  styleUrls: ['./fact-inspect.component.scss']
})
export class FactInspectComponent {
  @Input()
  focusedData: Focusable | undefined;

  constructor() {

  }

  get dataInDay(): ComplexNutrient {
    let nutrient = emptyNutrient();
    nutrient.complex = this.focusedData?.data.map((row) => [row, 1]) ?? [];
    nutrient = computeComplexMacro(nutrient, false);
    nutrient.name = "ate in a day";
    return nutrient;
  }

}
