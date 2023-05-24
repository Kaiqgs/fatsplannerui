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
  Macronutrients,
  emptyNutrient,
  complexFromGroup,
} from 'src/common/models/fatfacts.model';
import { MatDatepicker } from '@angular/material/datepicker';
import { Focusable } from '../app.component';
import fuzzysort from 'fuzzysort';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MacroMatchDialogComponent } from '../macro-match-dialog/macro-match-dialog.component';
import { PlanningDetails } from 'src/common/models/planning.model';
import {
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { AddNutrientDialogComponent } from '../nutrient-bank/add-nutrient-dialog/add-nutrient-dialog.component';
import { DbService } from '../db.service';

interface DiarySchema {
  id: number | undefined,
  record: ComplexNutrient,
  datetime: Date,
}

const allDays: Date[] = [];

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss'],
})
export class DiaryComponent {
  objOptions: ComplexContainer = [];
  mealOptions: string[] = ['Other', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];
  macros: ComplexNutrient = emptyNutrient();
  date: FormControl = new FormControl(new Date());
  private _isDialogOpen = false;
  private _records: DiarySchema[] = [];

  @ViewChild(MatDatepicker, { read: undefined, static: false })
  picker!: MatDatepicker<Date>;

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

    _db.table('diary').toArray().then((data) => {
      allDays.push(...data.map(d => d.datetime as Date));
      allDays.push(new Date());
    });

    this.getToday().then((data) => {
      this._records = data;
      this.macros = complexFromGroup(this.records);
      console.log("Macro", this.macros);
      console.log("Today's data", data);
      console.log("Today's records", this.records);
      this.focusDiary("InitialDiary");
    });
  }

  ngOnInit(): void {
    console.log(this.picker);
  }

  get dateTodaySelected(): Date {
    return new Date(this.date.value);
  }

  isInDb = (d: Date | null): boolean => {
    //TODO: handle that when new day arrives, this needs to be updated;
    if (!allDays) return true;
    const compareDays = [...allDays, new Date()];
    const day = (d || new Date());
    return compareDays?.some((date) => {
      return date.getDate() === day.getDate()
    });
  };

  public onSelectToday() {
    this.getToday().then((data) => {
      this._records = data;
      this.macros = complexFromGroup(this.records);
      console.log("Macro", this.macros);
      console.log("Today's data", data);
      console.log("Today's records", this.records);
      this.focusDiary(`Diary${Math.random()}`);
    });
  }

  get startEndDate(): [Date, Date] {
    const todayStart = this.dateTodaySelected;
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = this.dateTodaySelected;
    todayEnd.setHours(23, 59, 59, 999);
    return [todayStart, todayEnd];
  }

  async getToday(): Promise<DiarySchema[]> {
    const [todayStart, todayEnd] = this.startEndDate;
    const todaysData = await this._db.table('diary').where('datetime').between(todayStart, todayEnd).sortBy('id');
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
    const now = this.dateTodaySelected;
    const actualNowTime = new Date();
    now.setHours(actualNowTime.getHours());
    now.setMinutes(actualNowTime.getMinutes());
    const diaryItem = {
      record: record,
      datetime: now,
    } as DiarySchema;

    this._records.push(diaryItem)
    this._db.table('diary').put(diaryItem);
    this.macros = complexFromGroup(this.records);
    this.focusDiary(`DiaryAdd${this._records.length}`);
  }

  public focusDiary(name: string = 'Diary') {
    this.onFocusEvent.emit({
      name, data: this.records, handleEdit: (index: number, level: number) => {

      },
      handleDelete: (index: number, level: number) => {
        if (level != 0) {
          throw new Error('Not implemented');
        }
        const record = this._records.splice(index, 1);
        this._db.table('diary').delete(record[0].id as number);
        this.focusDiary(`DiaryDelete${this._records.length}`);
      }
    } as Focusable);
  }

  public resetDiary() {
    const [todayStart, todayEnd] = this.startEndDate;
    this._db.table('diary').where('datetime').between(todayStart, todayEnd).delete().then(() => {
      this._records = [];
      this.macros = emptyNutrient();
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
        if (result) {
          this.addRecord(result);
        }
        this._isDialogOpen = false;
      });
  }

  @HostListener('document:keydown.shift.a', ['$event'])
  keyEvent(_event: KeyboardEvent) {
    if (!this._isDialogOpen && document.activeElement?.tagName.toLowerCase() !== 'input') {
      this.addComplex();
    }
  }
}
