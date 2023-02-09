import { FactPlanningContainer } from './factplanning.model';
import { ComplexContainer } from './fatfacts.model';

export interface Recipe {
  name: string;
  data: ComplexContainer;
  compute: FactPlanningContainer | undefined;
}
