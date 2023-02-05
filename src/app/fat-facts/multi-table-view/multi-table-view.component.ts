import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  FactPlanning,
  FactPlanningContainer,
} from 'src/common/models/factplanning.model';
import {
  FatsecretContainer,
  FatsecretContainerContainer,
  FatsecretData,
} from 'src/common/models/fatfacts.model';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-multi-table-view',
  templateUrl: './multi-table-view.component.html',
  styleUrls: ['./multi-table-view.component.scss'],
})
export class MultiTableViewComponent implements OnInit {
  @Input()
  limit: number = 25;
  
  @Input()
  groupedFacts: FactPlanningContainer = [];

  @Input()
  displayColumns: Array<string> = [];

  @Input()
  transform: CallableFunction = (x: number) => x;

  @ViewChildren('table')
  tables!: QueryList<TableComponent>;

  get limitDivided() {
    return this.limit / this.groupedFacts.length;
  }

  get selectedGroups() {
    const flatgroup: Array<FatsecretContainer> = [];
    this.tables.forEach((item, index) => {
      if (item.selected) {
        flatgroup.push(item.data.data);
      }
    });

    return flatgroup;
    //return this.tables.map()
  }

  constructor() {}

  ngOnInit(): void {}
}
