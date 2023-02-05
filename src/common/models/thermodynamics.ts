import { MacroCalories, Macronutrients } from './fatfacts.model';

export function getKcal(macros: Macronutrients): number {
  return (
    MacroCalories.carbs * macros.carbs +
    MacroCalories.prots * macros.prots +
    MacroCalories.fats * macros.fats
  );
}

export function getMacroPct(
  macros: Macronutrients,
  kcal: number | null = null
): Macronutrients {
  const result = Object.assign({}, macros);
  if (kcal === null) {
    kcal = getKcal(macros);
  }
  result.carbs = (MacroCalories.carbs * macros.carbs) / kcal;
  result.prots = (MacroCalories.prots * macros.prots) / kcal;
  result.fats = (MacroCalories.fats * macros.fats) / kcal;
  result.kcal = 1;

  return result;
}
