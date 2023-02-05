import { Component, Input } from '@angular/core';
import { PlanningDetails } from 'src/common/models/planning.model';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {
  @Input()
  planningDetails!: PlanningDetails;
}
