import { Component, ElementRef, EventEmitter, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  FatFactsContainer,
  ComplexContainer,
  FatFacts,
  ComplexContainer2D,
} from 'src/common/models/fatfacts.model';
import { FatSource } from 'src/common/models/fatsource.model';
import { PlanningDetails } from 'src/common/models/planning.model';
import { FatFactsComponent } from './fat-facts/fat-facts.component';
import { AddRecipeCallback } from './recipes/recipes.component';

export type Focusable = [string, ComplexContainer];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'fatsplannerui';
  focusedData: Focusable | undefined;
  planning!: PlanningDetails;
  sourceFacts: ComplexContainer2D = [];
  database: ComplexContainer = [];
  constructor() {}

  @ViewChild('facts')
  facts!: ElementRef<FatFactsComponent>;

  onChangeSource(source: ComplexContainer2D) {
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
  onNewDatabase(event: ComplexContainer) {
    this.database = event;
  }
}
