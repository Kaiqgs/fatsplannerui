import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  ComplexNutrient,
  computeComplexMacro,
  ComplexContainer,
  ComplexReadContainer,
  Macronutrients,
  macroRatio,
  macroRatioDiff,
} from 'src/common/models/fatfacts.model';

type MatchAttempt = [number, Macronutrients, string];

@Component({
  selector: 'app-macro-match-dialog',
  templateUrl: './macro-match-dialog.component.html',
  styleUrls: ['./macro-match-dialog.component.scss'],
})
export class MacroMatchDialogComponent {
  // @Input() source!: FatsecretContainer;
  // @Input() target!: Macronutrients;
  source!: ComplexReadContainer;
  target!: Macronutrients;

  bestOptions: MatchAttempt[] = [];

  constructor(
    private _dialogRef: MatDialogRef<MacroMatchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(this.target);
    console.log(this.source);
    this.source = data.source;
    this.target = data.target;
  }

  matchTarget() {
    let k = 10;
    //compute macroRatio for target;
    //then:
    //iterates over all source items;
    //computes macroRatio for each item;
    // find closest `k` matching macroRatio;
    let targetRatio = macroRatio(this.target);
    let matches: MatchAttempt[] = this.source.map((item) => {
      let diff = macroRatioDiff(item, targetRatio);
      return [diff, item, item.name];
    });
    matches.sort((a, b) => a[0] - b[0]);
    this.bestOptions = matches.slice(0, k);
  }

  //
  multiMatchTarget() {
    // first we can precompute macroRatio for `target` as `targetRatio`;
    // then premap macroRatio for `source` array;
    // multi dimensional random search goes as follows.
    // Let
    // N = number of items in `source`;
    // K = number of non-repetible combinations;
    // M = number of mixable proportions;
    // R = number of random iterations;

    let n = this.source.length;
    let k = 4;
    let r = 10000;
    let topk = 4;

    if (n < k * 10) {
      return;
    }

    let targetRatio = macroRatio(this.target);
    let sourceRatios = this.source.map((item) => macroRatio(item));

    for (let i = 0; i < r; i++) {
      let combinationCount = Math.random() * k;
      let combinationIndexes: number[] = [];
      let macro: ComplexNutrient = {
        complex: [],
        name: '',
        meal: '',
        source: '',
        unit: '',
        amount: 0,
        sodium: 0,
        fiber: 0,
        carbs: 0,
        prots: 0,
        fats: 0,
        kcal: 0,
      };
      for (let j = 0; j < combinationCount; j++) {
        //check if index is already in combinationIndexes
        let idx = Math.floor(Math.random() * n);
        if (combinationIndexes.includes(idx)) {
          j--;
          continue;
        }
        macro.complex.push([
          { ...this.source[idx], complex: [] },
          Math.random(),
        ]);
        combinationIndexes.push(idx);
      }
      macro = computeComplexMacro(macro);
      let diff = macroRatioDiff(macro, targetRatio);
      this.bestOptions.push([diff, macro, macro.name]);
    }
    this.bestOptions.sort((a, b) => a[0] - b[0]);
    this.bestOptions = this.bestOptions.slice(0, topk);
  }
}
