import { Component, Input } from '@angular/core';
import { Macronutrients, macroRatio } from 'src/common/models/fatfacts.model';

interface MacroDisplay {
  value: number,
  ratio: number,
  name: string,
  color: string
}

@Component({
  selector: 'app-macros-bar',
  templateUrl: './macros-bar.component.html',
  styleUrls: ['./macros-bar.component.scss'],
})
export class MacrosBarComponent {
  @Input()
  public showKcal = false;

  @Input()
  readOnly = true;

  @Input()
  public macros: Macronutrients = { carbs: 0, prots: 0, fats: 0, kcal: 0 };

  public get view(): Macronutrients {
    return {
      carbs: parseFloat(this.macros.carbs.toPrecision(3)),
      prots: parseFloat(this.macros.prots.toPrecision(3)),
      fats: parseFloat(this.macros.fats.toPrecision(3)),
      kcal: parseFloat(this.macros.kcal.toPrecision(3)),
    } as Macronutrients;
  }

  public get percents(): Macronutrients {
    return macroRatio(this.macros);
  }

  //colors
  public colors: string[] = ['bg-secondary', '', 'bg-success', 'bg-danger'];
  public names: string[] = ['kcal', 'carbs', 'prots', 'fats'];

  get parsed(): MacroDisplay[] {
    let map: MacroDisplay[] = [];
    // iterate each key in view() and percents();
    this.names.forEach((name, index) => {
      if (!this.showKcal && index == 0) return;
      map.push({
        value: (this.view as any)[name],
        ratio: (this.percents as any)[name],
        name,
        color: this.colors[index],
      });
    });
    return map;
  }

  // form: FormGroup;
  // constructor(private _fb: FormBuilder) {
  //   this.form = this._generateForm();
  //   this.valueChanged.subscribe((x) => {this.form = this._generateForm(x)});
  // }
  pctify(value: number) {
    return (value * 100).toFixed(1) + '%';
  }

  // _generateForm(initial: Macronutrients = { carbs: 0, prots: 0, fats: 0, kcal: 0 }) {
  //   return this._fb.group({
  //       carbs: [initial.carbs],
  //       prots: [initial.prots],
  //       fats: [initial.fats],
  //       kcal: [initial.kcal],
  //   });
  // }
}
