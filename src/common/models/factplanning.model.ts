import {
  ComplexNutrient,
  ComplexContainer,
  LabeledNutrient,
  MacroCalories,
} from './fatfacts.model';

let _globalFactCounter = 0;

export class FactPlanning {
  id: number;
  constructor(private fatdata: ComplexContainer) {
    _globalFactCounter += 1;
    this.id = _globalFactCounter;
  }

  getData(operation: CallableFunction = (x: Number) => x): PlanningResponse {
    const trackSum = [
      'amount',
      'carbs',
      'prots',
      'fats',
      'kcal',
      'fiber',
      'sodium',
    ];
    const sum: any = {
      amount: 0,
      carbs: 0,
      prots: 0,
      fats: 0,
      kcal: 0,
      fiber: 0,
      sodium: 0,
      source: '__internal__',
      meal: 'internal',
      name: 'Resulting: ',
      unit: '',
    };
    const data = this.fatdata.map((data: ComplexNutrient): ComplexNutrient => {
      const res: any = Object.assign({}, data);
      trackSum.forEach((key) => {
        res[key] = operation(res[key] || 0, key, data);
        sum[key] += res[key];
        res[key] = res[key] == 0 ? '' : Math.round(res[key]);
      });
      return res;
    });

    trackSum.forEach((key) => {
      sum[key] = Math.round(sum[key] as number);
    });

    sum.carbs +=
      ' / ' +
      Math.round(((sum.carbs * MacroCalories.carbs) / sum.kcal) * 100) +
      '%';
    sum.prots +=
      ' / ' +
      Math.round(((sum.prots * MacroCalories.prots) / sum.kcal) * 100) +
      '%';
    sum.fats +=
      ' / ' +
      Math.round(((sum.fats * MacroCalories.fats) / sum.kcal) * 100) +
      '%';
    return { data: data, sum: sum, representative: 'none', id: this.id };
  }
}

export interface FactPlanningContainer extends Array<FactPlanning> {}
export interface PlanningResponse {
  id: number;
  data: ComplexContainer;
  sum: LabeledNutrient;
  representative: string;
}
