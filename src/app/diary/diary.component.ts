import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {
  dataFromReference,
  FatsecretContainer,
  FatsecretData,
  FatsecreteReadContainer,
  MacroCalories,
  macroFromGroup,
  Macronutrients,
  macroRatio,
} from 'src/common/models/fatfacts.model';
import { Focusable } from '../app.component';

import fuzzysort from 'fuzzysort';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MacroMatchDialogComponent } from '../macro-match-dialog/macro-match-dialog.component';
import { PlanningDetails } from 'src/common/models/planning.model';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';

type ConsumptionHistory = { [key: string]: Array<Date> };
type DiaryHistory = [Date, FatsecretContainer];

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss'],
})
export class DiaryComponent {
  history: [Date, FatsecretContainer];
  consumption: ConsumptionHistory = {};
  objOptions: FatsecretContainer = [];
  mealOptions: string[] = ['Other', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];
  macros: Macronutrients = { carbs: 0, prots: 0, fats: 0, kcal: 0 };

  @Input()
  public source: FatsecreteReadContainer = [];

  @Input()
  planning!: PlanningDetails;

  @Output()
  public onFocusEvent = new EventEmitter<Focusable>();

  @ViewChild('nameInput')
  nameInput!: HTMLInputElement;

  public form!: FormGroup;

  constructor(
    private _cookieService: CookieService,
    private _fb: FormBuilder,
    private _dialog: MatDialog
  ) {
    let history: DiaryHistory = [new Date(), []];

    if (_cookieService.check('diaryHistory')) {
      history = JSON.parse(_cookieService.get('diaryHistory'));
      history[0] = new Date(history[0]);
    }

    if (history[0].getDate() !== new Date().getDate()) {
      history = [new Date(), []];
    }

    console.log(history);
    this.history = history;
    this._generateForm();
    this.macros = macroFromGroup(this.history[1]);
    if (this.planning) {
      this.macros.kcal = this.planning.target.kcal - this.macros.kcal;
    }
  }

  get missingMacros() {
    const target = this.planning?.target;
    //use macroRatio
    let kcalLength = Math.abs(target.kcal - this.macros.kcal);
    const missing: Macronutrients = {
      carbs: target.carbs - this.macros.carbs,
      prots: target.prots - this.macros.prots,
      fats: target.fats - this.macros.fats,
      kcal: kcalLength,
    };
    return missing;
    const mratio = macroRatio(missing);

    return mratio;
  }
  //generate form
  _generateForm() {
    this.form = this._fb.group({
      name: [''],
      amount: [''],
      meal: ['Other'],
    });
  }

  //onKeyDown try add record if enter is pressed;
  public searchBoxKeyDown(event: KeyboardEvent) {
    const options = fuzzysort.go(
      (event.target as HTMLInputElement).value,
      this.source,
      { keys: ['name'] }
    );
    const bestOptions = options.slice(0, 5);
    this.objOptions = bestOptions.map((option) => option.obj);
    console.log(bestOptions);
  }

  selectAutocomplete(event: MatAutocompleteSelectedEvent) {
    this.objOptions.sort((x) => (x.name === event.option.value.name ? 1 : -1));

    console.log(event.option);
  }

  //anyInputKeyDown try add record if enter is pressed;
  public anyInputKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const selected = this.objOptions[0];
      const newObj = dataFromReference(
        selected,
        this.form.value.amount,
        this.form.value.meal
      );
      this.addRecord(newObj);
      this.macros = macroFromGroup(this.history[1]);
      this._generateForm();
      this.nameInput?.focus();
    }
  }

  //Adds one record to the history;
  public addRecord(record: FatsecretData) {
    this.history[1].push(record);
    this._cookieService.set('diaryHistory', JSON.stringify(this.history));
    this.consumption[record.name] = this.consumption[record.name] || [];
    this.consumption[record.name].push(new Date());
    //set cookie for consumption history;
    this._cookieService.set(
      'diaryConsumptionHistory',
      JSON.stringify(this.consumption)
    );
  }

  public onFocus() {
    this.onFocusEvent.emit(['Diary', this.history[1]]);
  }
  //resetDiary resets cookies and reloads the page;
  public resetDiary() {
    this._cookieService.delete('diaryHistory');
    window.location.reload();
  }

  public matchTarget(target: Macronutrients) {
    this._dialog.open(MacroMatchDialogComponent, {
      data: {
        target,
        source: this.source,
      },
    });
  }
}
