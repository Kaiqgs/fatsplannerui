import {
  Component,
  Input,
  ViewChildren,
  QueryList,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTable as MatTable } from '@angular/material/legacy-table';
import groupBy from 'lodash/groupBy';
import {
  FactPlanning,
  FactPlanningContainer,
} from 'src/common/models/factplanning.model';

import {
  ComplexContainer,
  FatFacts,
  LabeledNutrient,
  ComplexContainer2D,
  MacroCalories,
  ComplexNutrient,
} from 'src/common/models/fatfacts.model';
import { PlanningDetails } from 'src/common/models/planning.model';
import { Recipe } from 'src/common/models/recipe.model';
import { MultiTableViewComponent } from './multi-table-view/multi-table-view.component';

@Component({
  selector: 'app-fat-facts',
  templateUrl: './fat-facts.component.html',
  styleUrls: ['./fat-facts.component.scss'],
})
export class FatFactsComponent {
  @Input()
  sourceFacts: ComplexContainer2D = [];

  @Input()
  planning!: PlanningDetails;
  
  @ViewChildren('multiTableView')
  multiTableView = new QueryList<MultiTableViewComponent>();

  get selectTables() {
    const tableGroups: Array<ComplexContainer2D> = [];
    this.multiTableView.forEach((element) => {
      tableGroups.push(element.selectedGroups);
    });
    return tableGroups.flat();
  }

  weekTransform = (row: number) => {
    return row * (this.planning?.schedule.mealForDays || 1);
  };

  weekInvertTransform = (row: number) => {
    return row / (this.planning?.schedule.mealForDays || 1);
  };

  get flatFacts(): ComplexContainer {
    return this.sourceFacts.flat();
  }

  get groupedFact(): FactPlanningContainer {

    let groups = groupBy(this.flatFacts, (data: ComplexNutrient) => {
      const group =
        (this.planning?.grouping.meal ? data.meal : '') +
        (this.planning?.grouping.source ? data.source : '') +
        (this.planning?.grouping.name ? data.name : '');
      return group;
    });

    const tgroups: FactPlanningContainer = [];
    for (const group in groups) {
      tgroups.push(new FactPlanning(groups[group]));
    }

    return tgroups;
  }

  //displayedColumns = ['name', 'amount', 'unit'];
  displayedColumns = ['name', 'amount', 'unit', 'carbs', 'fats', 'prots', 'kcal'];

  displayableColumns = [...this.displayedColumns, 'source', 'meal'];

  constructor() {}

  stringify(obj: any) {
    return JSON.stringify(obj.data);
  }
}
