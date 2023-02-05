import { FatSource } from './fatsource.model';

export interface Macronutrients {
  carbs: number;
  prots: number;
  fats: number;
  kcal: number;
}

// export interface Macroratioed extends Macronutrients {
//   carbsRatio: number;
//   protsRatio: number;
//   fatsRatio: number;
// }

export enum MacroCalories {
  carbs = 4,
  prots = 4,
  fats = 9,
}

export interface FatsecretData extends Macronutrients {
  name: string;
  meal: string; // this is relational to meal table;
  source: string; // this is relational to fatsecret fat table;
  unit: string;
  amount: number;
  sodium: number;
  fiber: number;
}

export interface ComplexMacronutrient extends FatsecretData {
  complex: Array<[ComplexMacronutrient, number]>;
}

export function computeComplexMacro(
  macro: ComplexMacronutrient
): ComplexMacronutrient {
  //sum all the weights first
  let weight = macro.complex.reduce((acc, item) => acc + item[1], 0);
  macro.complex.forEach((item) => {
    const weighted = item[1] / weight;
    macro.kcal += item[0].kcal * weighted;
    macro.carbs += item[0].carbs * weighted;
    macro.prots += item[0].prots * weighted;
    macro.fats += item[0].fats * weighted;
    macro.sodium += item[0].sodium * weighted;
    macro.fiber += item[0].fiber * weighted;
    macro.name += `${item[0].name} (${(weighted * 100).toFixed(1)}%) + `;
  });
  return macro;
}

export function dataFromReference(
  data: FatsecretData,
  amount: number,
  meal: string
): FatsecretData {
  // scale data by amount
  const scaleFactor = amount / data.amount;
  const scaledData: FatsecretData = {
    ...data,
    amount: amount,
    meal: meal,
    kcal: data.kcal * scaleFactor,
    carbs: data.carbs * scaleFactor,
    prots: data.prots * scaleFactor,
    fats: data.fats * scaleFactor,
    sodium: data.sodium * scaleFactor,
    fiber: data.fiber * scaleFactor,
  };
  return scaledData;
}

export function macroFromGroup(data: Macronutrients[]): Macronutrients {
  //sums all macronutrients from a group
  const macro: Macronutrients = {
    kcal: 0,
    carbs: 0,
    prots: 0,
    fats: 0,
  };
  data.forEach((element) => {
    macro.kcal += element.kcal;
    macro.carbs += element.carbs;
    macro.prots += element.prots;
    macro.fats += element.fats;
  });
  return macro;
}

export function macroRatio(data: Macronutrients) {
  const ratio: Macronutrients = {
    kcal: 1,
    carbs: 0,
    prots: 0,
    fats: 0,
  };
  //add ternary for zero division
  ratio.carbs = data.carbs ? (data.carbs * MacroCalories.carbs) / data.kcal : 0;
  ratio.prots = data.prots ? (data.prots * MacroCalories.prots) / data.kcal : 0;
  ratio.fats = data.fats ? (data.fats * MacroCalories.fats) / data.kcal : 0;
  return ratio;
}

export function macroRatioDiff(
  macro: Macronutrients,
  targetRatio: Macronutrients
) {
  const ratioA = macroRatio(macro);

  let diff =
    Math.abs(targetRatio.carbs - ratioA.carbs) +
    Math.abs(targetRatio.prots - ratioA.prots) +
    Math.abs(targetRatio.fats - ratioA.fats);
  diff /= 3;
  diff *= 100;
  return diff;
}

export interface FatItem {
  data: Array<string>;
  nameAmount: string | undefined;
}

export interface FatTable {
  data: Array<FatItem>;
  header: FatItem;
}

export class FatFacts {
  document: Document | undefined;
  allfatdata: FatsecretContainer = [];
  brief: string = 'default';
  fatsmapping = [
    'nameAmount',
    'sodium',
    'fats',
    'carbs',
    'fibers',
    'prots',
    'kcal',
  ];

  fatSecretNamePattern: RegExp =
    /^(.*?)\s*([+-]?([0-9]*[.])?[0-9]+)\s*(g|porção|ml|un|xícara|grandes|grande|colher de chá)$/;

  constructor(source: FatSource) {
    const cropHTML = source.html
      .replace(/\.+/g, '')
      .replace(/,+/g, '.')
      .replace(/\s+/g, ' ')
      .toLowerCase();
    this.brief = source.brief;
    try {
      this.document = new DOMParser().parseFromString(cropHTML, 'text/html');
      this._parseFatsources();
      console.log('Facts instance success: ' + this.allfatdata.length);
    } catch (typeError) {
      console.log((typeError as string).slice(0, 15) + '...');
    }
  }
  _parseFatsources() {
    const tableObj =
      this.document?.querySelectorAll('table.foodsnutritiontbl') || [];

    let mealName = undefined;
    for (const key in tableObj) {
      const tablegeneric = tableObj[key];
      const tbody = tablegeneric.firstElementChild;
      const trow = tbody?.firstElementChild;
      const tdatas = trow?.children;
      const fdata: any = {};

      for (let i = 0; i < (tdatas?.length || 0); ++i) {
        const item = tdatas?.item(i)?.textContent?.trim() || '';
        fdata[this.fatsmapping[i]] = item;
      }
      fdata.meal = mealName;
      fdata.source = this.brief;

      //TODO: parse REGEX nameAmount to -> name, amount, unit
      let out = this.fatSecretNamePattern.exec(fdata.nameAmount);
      if (out) {
        const parsedfatdata = Object.assign({}, fdata);
        delete parsedfatdata.nameAmount;
        parsedfatdata.name = out[1].trim();
        parsedfatdata.amount = (out[3] || '') + out[2];
        parsedfatdata.unit = out[4];
        for (let key in parsedfatdata) {
          const temp = parseFloat(parsedfatdata[key]);
          if (!isNaN(temp)) {
            parsedfatdata[key] = temp;
          }
        }

        this.allfatdata.push(parsedfatdata as FatsecretData);
      } else {
        mealName = fdata.nameAmount;
        console.log('failed: ' + fdata.nameAmount);
      }
    }
    //console.log(this.allfatdata);
  }
}

export interface FatFactsContainer extends Array<FatFacts> {}
export interface FatsecretContainer extends Array<FatsecretData> {}
export interface FatsecreteReadContainer extends ReadonlyArray<FatsecretData> {}
export interface FatsecretContainerContainer
  extends Array<FatsecretContainer> {}
