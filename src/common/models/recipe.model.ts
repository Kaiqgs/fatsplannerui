import { FactPlanningContainer } from './factplanning.model';
import { FatsecretContainer } from './fatfacts.model';

export interface Recipe {
  name: string;
  data: FatsecretContainer;
  compute: FactPlanningContainer | undefined;
}
