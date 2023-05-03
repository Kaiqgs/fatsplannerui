import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  HostListener,
} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {
  ComplexNutrient,
  dataFromReference,
  ComplexContainer,
  ComplexReadContainer,
  macroFromGroup,
  Macronutrients,
  MacroContainer,
  emptyMacro,
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

type ConsumptionHistory = { [key: string]: Array<Date> };

interface RecordHistory {
  date: Date;
  records: string[];
}

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss'],
})
export class DiaryComponent {
  history: ComplexContainer = [];
  consumption: ConsumptionHistory = {};
  objOptions: ComplexContainer = [];
  mealOptions: string[] = ['Other', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];
  macros: Macronutrients = emptyMacro();
  records: RecordHistory;
  private _isDialogOpen = false;

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
    private _cookieService: CookieService,
    private _fb: FormBuilder,
    private _dialog: MatDialog
  ) {
    this.records = {
      date: new Date(),
      records: [],
    };
    this._readCookies();
    this._generateForm();
    this.macros = macroFromGroup(this.history);
    this._handleTodayChanged();
    if (this.planning) {
      this.macros.kcal = this.planning.target.kcal - this.macros.kcal;
    }
  }

  ngOnInit(): void {
    this.onFocus();
  }

  private _handleTodayChanged() {
    if (this.records.date.getDate() !== new Date().getDate()) {
      //check if history is valid;
      //if valid store on cookies
      let metack = this._cookieService.get('diaryMetaHistory');
      let meta: MacroContainer = metack ? JSON.parse(metack) : [];
      meta.push(this.macros);
      this._cookieService.set('diaryMetaHistory', JSON.stringify(meta), 365);
      this.resetDiary();
    }
  }

  private _readCookies() {
    if (this._cookieService.check('diaryHistory')) {
      this.records = JSON.parse(this._cookieService.get('diaryHistory'));
      this.records.date = new Date(this.records.date);
    }
    this.records.records.forEach((code) => {
      let history = this._cookieService.get(code);
      if (history) {
        this.history.push(JSON.parse(history));
      }
    });
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
    const randomName = `diary:${Math.random().toString(36).substring(7)}`;
    this.records.records.push(randomName);
    this._cookieService.set(randomName, JSON.stringify(record), 365);
    this.history.push(record);
    this.macros = macroFromGroup(this.history);
    this._cookieService.set('diaryHistory', JSON.stringify(this.records), 365);
    // this.consumption[record.name] = this.consumption[record.name] || [];
    // this.consumption[record.name].push(new Date());
    // //set cookie for consumption history;
    // this._cookieService.set(
    //   'diaryConsumptionHistory',
    //   JSON.stringify(this.consumption),
    //  365
    // );
  }

  public onFocus() {
    this.onFocusEvent.emit({name:'Diary', data:this.history} as Focusable);
  }
  //resetDiary resets cookies and reloads the page;
  public resetDiary() {
    this.records.records.forEach((code) => { this._cookieService.delete(code); });
    this._cookieService.delete('diaryHistory');
    this.history = [];
    this.macros = emptyMacro();
    this.records.records = [];
    this.onFocusEvent.emit({name:'Diary Change', data: this.history} as Focusable);
  }

  public resetDiaryReload() {
    this.resetDiary();
    // window.location.reload();
  }

  public matchTarget(target: Macronutrients) {
    this._dialog.open(MacroMatchDialogComponent, {
      data: {
        target,
        source: this.source,
      },
    });
  }

  public showAddComplex() {
    this._isDialogOpen = true;
    this._dialog
      .open(ComposeComplexDialogComponent, {
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

  public addComplex(){
    this._isDialogOpen = true;
    this._dialog
      .open(AddNutrientDialogComponent, {
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
  keyEvent(_event: KeyboardEvent)
  {
    if(!this._isDialogOpen){
      this.addComplex();
    }
  }
}
