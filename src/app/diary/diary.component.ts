import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  HostListener,
} from '@angular/core';
import {
  ComplexNutrient,
  dataFromReference,
  ComplexContainer,
  ComplexReadContainer,
  macroFromGroup,
  Macronutrients,
  emptyMacro,
  computeComplexMacro,
  emptyNutrient,
} from 'src/common/models/fatfacts.model';
import { Focusable } from '../app.component';

import fuzzysort from 'fuzzysort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MacroMatchDialogComponent } from '../macro-match-dialog/macro-match-dialog.component';
import { PlanningDetails } from 'src/common/models/planning.model';
import {
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { ComposeComplexDialogComponent } from '../compose-complex-dialog/compose-complex-dialog.component';
import { AddNutrientDialogComponent } from '../nutrient-bank/add-nutrient-dialog/add-nutrient-dialog.component';
import { DbService } from '../db.service';

interface DiarySchema {
  id: number | undefined,
  record: ComplexNutrient,
  datetime: Date,
}

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss'],
})
export class DiaryComponent {
  objOptions: ComplexContainer = [];
  mealOptions: string[] = ['Other', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];
  macros: Macronutrients = emptyMacro();
  private _isDialogOpen = false;
  private _records: DiarySchema[] = [];

  @Input()
  public source: ComplexReadContainer = [];

  @Input()
  planning!: PlanningDetails;

  @Output()
  public onFocusEvent = new EventEmitter<Focusable>();

  @ViewChild('nameInput')
  nameInput!: HTMLInputElement;

  public form!: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _dialog: MatDialog,
    private _db: DbService
  ) {
    this._generateForm();
    if (this.planning) {
      this.macros.kcal = this.planning.target.kcal - this.macros.kcal;
    }
    // this._db.table('diary').toArray().then((data: DiarySchema[]) => {
    //   console.log("All data", data);
    // });

    this.getToday().then((data) => {
      this._records = data;
      this.macros = macroFromGroup(this.records);
      console.log("Macro", this.macros);
      console.log("Today's data", data);
      console.log("Today's records", this.records);
      this.focusDiary("InitialDiary");
    });
  }

  ngOnInit(): void { }

  async getToday(): Promise<DiarySchema[]> {
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const todaysData = await this._db.table('diary').where('datetime').between(todayMidnight, todayEnd).toArray();
    return todaysData;
  };


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
    // const mratio = macroRatio(missing);
    // return mratio;
  }
  //generate form
  _generateForm() {
    this.form = this._fb.group({
      name: [''],
      amount: [''],
      meal: ['Other'],
    });
  }

  public get records(): ComplexNutrient[] {
    return this._records.map((record) => record.record);
  }

  public get unitRecord() {
    let nut = emptyNutrient();
    nut.complex = this.records.map((record) => [record, 1]);
    nut = computeComplexMacro(nut, false);
    nut.name = "Ate in a day";
    return nut
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
      this._generateForm();
      // this.nameInput?.focus();
    }
  }

  //Adds one record to the history;
  public addRecord(record: ComplexNutrient) {

    const now = new Date();
    const diaryItem = {
      record: record,
      datetime: now,
    } as DiarySchema;

    this._records.push(diaryItem)
    this._db.table('diary').put(diaryItem);
    this.macros = macroFromGroup(this.records);
    this.focusDiary('NewDiary');
  }

  public focusDiary(name: string = 'Diary') {
    this.onFocusEvent.emit({ name, data: this.records } as Focusable);
  }

  public resetDiary() {
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    this._db.table('diary').where('datetime').above(todayMidnight).delete().then(() => {
      this._records = [];
      this.macros = emptyMacro();
      this.focusDiary('ResetDiary');
    });
  }

  public matchTarget(target: Macronutrients) {
    this._dialog.open(MacroMatchDialogComponent, {
      data: {
        target,
        source: this.source,
      },
    });
  }

  public addComplex() {
    this._isDialogOpen = true;
    this._dialog
      .open(AddNutrientDialogComponent, {
        width: '50rem',
        data: {
          source: this.source,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        console.log('Result', result);
        if (result) {
          this.addRecord(result);
        }
        this._isDialogOpen = false;
      });
  }

  @HostListener('document:keydown.shift.a', ['$event'])
  keyEvent(_event: KeyboardEvent) {
    if (!this._isDialogOpen) {
      this.addComplex();
    }
  }
}
