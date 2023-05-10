import {  Component, ElementRef, ViewChild } from '@angular/core';
import {
  ComplexContainer,
  ComplexContainer2D,
  ComplexNutrient,
} from 'src/common/models/fatfacts.model';
import { PlanningDetails } from 'src/common/models/planning.model';
import { FatFactsComponent } from './fat-facts/fat-facts.component';
import { AddRecipeCallback } from './recipes/recipes.component';

export interface Focusable {
  name: string;
  data: ComplexNutrient[];
  handleDelete(index: number, level: number): void;
  handleEdit(index: number, level: number): void;
}

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
  constructor() { }

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
    let badFocus = !!(this.focusedData && this.focusedData.name === event.name);
    if (badFocus) {
      return;
    }
    this.focusedData = event;
    // this.onChangeSource(event.data);
  }

  deleteFocused(index: number, level: number) {
    this.focusedData?.handleDelete(index, level);
  }

  editFocused(index: number, level: number) {
    this.focusedData?.handleEdit(index, level);
  }

  //onNewDatabase takes fatsecret data and emits it to the fatfacts component
  onNewDatabase(event: ComplexContainer) {
    this.database = event;
  }
}
