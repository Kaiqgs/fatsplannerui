import { Component, ElementRef, EventEmitter, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  FatFactsContainer,
  FatsecretContainer,
  FatFacts,
  FatsecretContainerContainer,
} from 'src/common/models/fatfacts.model';
import { FatSource } from 'src/common/models/fatsource.model';
import { PlanningDetails } from 'src/common/models/planning.model';
import { FatFactsComponent } from './fat-facts/fat-facts.component';
import { AddRecipeCallback } from './recipes/recipes.component';

export type Focusable = [string, FatsecretContainer];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'fatsplannerui';
  focusedData: Focusable | undefined;
  planning!: PlanningDetails;
  sourceFacts: FatsecretContainerContainer = [];
  database: FatsecretContainer = [];
  constructor() {}

  @ViewChild('facts')
  facts!: ElementRef<FatFactsComponent>;

  onChangeSource(source: FatsecretContainerContainer) {
    this.sourceFacts = source;
  }

  toolbarChanges(event: PlanningDetails) {
    this.planning = event;
  }

  addRecipe(event: AddRecipeCallback) {
    console.log(this.facts?.nativeElement?.selectTables);
    event(this.facts?.nativeElement?.selectTables || []);
  }

  focusedDataChange(event: Focusable) {
    //check if the event is the same as the current focused data
    let badFocus = !!(this.focusedData && this.focusedData[0] === event[0]);
    if (badFocus) {
      return;
    }
    this.focusedData = event;
    this.onChangeSource([event[1]]);
  }

  //onNewDatabase takes fatsecret data and emits it to the fatfacts component
  onNewDatabase(event: FatsecretContainer) {
    this.database = event;
  }
}
