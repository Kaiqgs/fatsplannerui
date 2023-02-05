import { Macronutrients } from "./fatfacts.model";

export interface Groupable {
  [code:string]: boolean
}

export interface PlanningDetails {
  schedule: {
    mealForDays: number;
    mealsInDay: number;
  };
  target: Macronutrients;
  grouping: {
    meal: boolean,
    source: boolean,
    name: boolean,
  };
}
