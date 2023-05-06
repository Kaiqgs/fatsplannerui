import { FatSource } from './fatsource.model';

export interface Macronutrients {
  carbs: number;
  prots: number;
  fats: number;
  kcal: number;
}

export function emptyMacro(): Macronutrients {
  return {
    carbs: 0,
    prots: 0,
    fats: 0,
    kcal: 0,
  };
}

export function emptyNutrient(): ComplexNutrient {
  return {
    name: '',
    meal: '',
    source: '',
    unit: '',
    amount: 0,
    sodium: 0,
    fiber: 0,
    ...emptyMacro(),
    complex: [],
  };
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

export function generateUUID() { // Public Domain/MIT
  var d = new Date().getTime();//Timestamp
  var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'infoCollapse' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16;//random number between 0 and 16
    if (d > 0) {//Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {//Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

export interface LabeledNutrient extends Macronutrients {
  name: string;
  meal: string; // this is relational to meal table;
  source: string; // this is relational to fatsecret fat table;
  unit: string;
  amount: number;
  sodium: number;
  fiber: number;
}
function hashCode(str: string) {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    let chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
export function getNutrientIdentifier(data: ComplexNutrient): string {
  const str = `${data.name}-${data.meal}-${data.source}-${data.unit}`;
  // const hasharray = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  // btoa(String.fromCharCode(...new Uint8Array(hasharray)));
  return hashCode(str).toString(16);
}

export async function getNutrientHash(data: ComplexNutrient): Promise<string> {
  const str = JSON.stringify(data);
  const hasharray = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return btoa(String.fromCharCode(...new Uint8Array(hasharray)));
}

export type ComplexWeighted = [ComplexNutrient, number];
export interface ComplexNutrient extends LabeledNutrient {
  complex: Array<ComplexWeighted>;
}

export function computeComplexMacro(
  macro: ComplexNutrient,
  groupWeight: boolean = true
): ComplexNutrient {
  //sum all the weights first
  const weight = macro.complex.reduce((acc, item) => acc + item[1], 0);
  const units = new Set(macro.complex.map((item) => item[0].unit));
  macro.complex.forEach((item, index) => {
    const weighted = groupWeight ? item[1] / weight : 1;
    macro.kcal += item[0].kcal * weighted;
    macro.carbs += item[0].carbs * weighted;
    macro.prots += item[0].prots * weighted;
    macro.fats += item[0].fats * weighted;
    macro.sodium += item[0].sodium * weighted;
    macro.fiber += item[0].fiber * weighted;
    macro.amount += item[0].amount * weighted;
    macro.name += `${item[0].name}`;
    if (groupWeight) macro.name += `(${(weighted * 100).toFixed(1)}%)`;
    else macro.name += `(${item[0].amount} ${item[0].unit})`;
    if (index != macro.complex.length - 1) macro.name += ' + ';
  });
  macro.unit = Array.from(units).join('/');
  return macro;
}

export function dataFromReference(
  data: ComplexNutrient,
  amount: number,
  meal: string = ''
): ComplexNutrient {
  // scale data by amount
  const scaleFactor = amount / data.amount;
  const scaledData: ComplexNutrient = {
    ...data,
    amount: amount,
    meal: meal || data.meal,
    complex: data.complex || [],
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

export function coerceComplexNutrient(data: ComplexNutrient): ComplexNutrient {
  //coerces to correct type
  const coercedData: ComplexNutrient = {
    name: data.name.toString(),
    kcal: Number(data.kcal),
    carbs: Number(data.carbs),
    prots: Number(data.prots),
    fats: Number(data.fats),
    sodium: Number(data.sodium),
    fiber: Number(data.fiber),
    amount: Number(data.amount),
    source: data.source.toString(),  
    meal: data.meal.toString(),
    unit: data.unit.toString(),
    complex: data.complex,
  };
  return coercedData;

};

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
  allfatdata: ComplexContainer = [];
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

        this.allfatdata.push(parsedfatdata as ComplexNutrient);
      } else {
        mealName = fdata.nameAmount;
        console.log('failed: ' + fdata.nameAmount);
      }
    }
    //console.log(this.allfatdata);
  }
}

export interface FatFactsContainer extends Array<FatFacts> { }
export interface ComplexContainer extends Array<ComplexNutrient> { }
export interface ComplexReadContainer
  extends ReadonlyArray<ComplexNutrient> { }
export interface ComplexContainer2D
  extends Array<ComplexContainer> { }
export interface MacroContainer extends Array<Macronutrients> { }
