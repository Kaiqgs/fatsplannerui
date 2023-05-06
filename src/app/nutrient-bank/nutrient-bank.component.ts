import { Component, EventEmitter, Output } from '@angular/core';
import {
  ComplexContainer,
  ComplexNutrient,
  ComplexReadContainer,
  computeComplexMacro,
  emptyNutrient,
  getNutrientHash,
  getNutrientIdentifier,
  LabeledNutrient,
} from 'src/common/models/fatfacts.model';
import { LocalBankAsset } from 'src/app/nutrient-bank/nutrient-bank.taco';
import { Focusable } from '../app.component';
import { AddNutrientDialogComponent } from './add-nutrient-dialog/add-nutrient-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { getKcal } from 'src/common/models/thermodynamics';
import { HttpClient } from '@angular/common/http';
import { ComposeComplexDialogComponent } from '../compose-complex-dialog/compose-complex-dialog.component';
import { DbService } from '../db.service';

interface BankSchema {
  hash: string,
  record: ComplexNutrient,
  datetime: Date,
}

@Component({
  selector: 'app-nutrient-bank',
  templateUrl: './nutrient-bank.component.html',
  styleUrls: ['./nutrient-bank.component.scss'],
})
export class NutrientBankComponent {
  @Output()
  public onFocusEvent = new EventEmitter<Focusable>();

  @Output()
  public databaseChange = new EventEmitter<ComplexContainer>();

  public data: ComplexNutrient[] = [];
  private _nutBank: BankSchema[] = [];

  focusUserAdded: boolean = true;

  constructor(
    private _dialog: MatDialog,
    private _http: HttpClient,
    private _db: DbService
  ) {
    console.log(this.data);
    new LocalBankAsset()
      .readData(this._http)
      .then((data) => {
        this.data = data;
        this._readUserData();
        this.databaseChanged(this.data);
      }).catch((_) => {
        this._readUserData();
        this.databaseChanged(this.data);
      });
  }

  private _readUserData() {
    this._db.table('nutrientBank').toArray().then((bankRecord: BankSchema[]) => {
      bankRecord.forEach((nutrient) => {
        this._nutBank.push(nutrient);
        this.data.push(nutrient.record);
      });
    });
  }

  private async _createNewNutrient(result: ComplexNutrient | LabeledNutrient | undefined | null) {
    if (result !== undefined && result !== null) {
      const nutrient = result as ComplexNutrient;
      nutrient.meal = 'any';
      nutrient.source = 'user';
      nutrient.kcal = getKcal(nutrient);
      nutrient.complex = nutrient.complex || [];

      const hash = await getNutrientHash(nutrient);
      const record = {
        hash,
        record: nutrient,
        datetime: new Date()
      } as BankSchema;

      const exists = await this._db.table('nutrientBank').get(hash);
      if (exists !== undefined) return;

      await this._db.table('nutrientBank').put(record, hash);
      this.data.push(nutrient);
      this._nutBank.push(record);
      this.exportDatabase();
      this.databaseChanged(this.data);
      if (this.focusUserAdded) this.focusData("NewNutrientBank");
    }
  }

  get unitNutrient(): ComplexNutrient {
    let nutrient = emptyNutrient();
    if (this.focusUserAdded) {
      nutrient.complex = this._nutBank.map((nutrient) => [nutrient.record, 1]);
    }
    else {
      nutrient.complex = this.data.map((nutrient) => [nutrient, 1]);
    }
    console.log("UnitNutrient", nutrient);
    nutrient = computeComplexMacro(nutrient, false);
    nutrient.name = 'User added';
    console.log("UnitNutrient", nutrient);
    return nutrient;
  }

  ngOnInit(): void { }

  public focusData(name: string = "NutrientBank") {
    this.onFocusEvent.emit({ name, data: this._nutBank.map((n) => n.record) } as Focusable);
  }

  public databaseChanged(event: ComplexContainer) {
    this.databaseChange.emit(event);
  }

  //renders dialog with form to add new nutrient;
  //button click event
  public showNewNutrient() {
    this._dialog
      .open(AddNutrientDialogComponent, {
        width: '500px',
      })
      .afterClosed()
      .subscribe((result: LabeledNutrient) => {
        this._createNewNutrient(result);
      });
  }


  public showNewComplexNutrient() {
    this._dialog
      .open(AddNutrientDialogComponent, {
        width: '50rem',
        data: {
          source: this.data,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        console.log('Result', result);
        if (result) {
          this._createNewNutrient(result);
        }
      });
  }

  //exports `data` to JSON file;
  //then asks to download to user's computer;
  public exportDatabase() {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(this.data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'nutrientBank.json');
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  //erase cookies and reload page;
  public resetDatabase() {
    this._db.table('nutrientBank').clear();
    window.location.reload();
  }

}
