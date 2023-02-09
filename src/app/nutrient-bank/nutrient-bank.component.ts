import { Component, EventEmitter, Output } from '@angular/core';
import {
  ComplexContainer,
  ComplexNutrient,
  ComplexReadContainer,
  getNutrientIdentifier,
  LabeledNutrient,
} from 'src/common/models/fatfacts.model';
import { LocalBankAsset } from 'src/app/nutrient-bank/nutrient-bank.taco';
import { Focusable } from '../app.component';
import { CookieService } from 'ngx-cookie-service';
import { AddNutrientDialogComponent } from './add-nutrient-dialog/add-nutrient-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { getKcal } from 'src/common/models/thermodynamics';
import { HttpClient } from '@angular/common/http';
import { ComposeComplexDialogComponent } from '../compose-complex-dialog/compose-complex-dialog.component';

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

  public data: ComplexContainer = [];
  private nutrientBank: string[] = [];

  constructor(
    private _cookieService: CookieService,
    private _dialog: MatDialog,
    private _http: HttpClient
  ) {
    console.log(this.data);
    new LocalBankAsset()
      .readData(this._http)
      .then((data) => {
        data.forEach((nutrient) => {
          this._pushNewToBank(nutrient);
        });
        this._readFromCookies();
        this.databaseChanged(this.data);
      }).catch((_) => {
        this._readFromCookies();
        this.databaseChanged(this.data);
      });
  }

  private _pushNewToBank(nutrient: ComplexNutrient) {
    const nutrId = getNutrientIdentifier(nutrient);
    const notPresent = !this.data.find((item) => getNutrientIdentifier(item) === nutrId);
    if (notPresent) {
      this.data.push(nutrient);
    }
    else {
      console.log('duplicate found');
    }
  }

  private _readFromCookies() {
    if (this._cookieService.check('nutrientBank')) {
      this.nutrientBank = JSON.parse(this._cookieService.get('nutrientBank'));
      this.nutrientBank.forEach((cookieName) => {
        if (this._cookieService.check(cookieName)) {
          const parsedNutrient = JSON.parse(this._cookieService.get(cookieName));
          this._pushNewToBank(parsedNutrient);
        }
      }
      );
    }
  }

  private _createNewNutrient(result: ComplexNutrient | LabeledNutrient | undefined | null) {
    if (result !== undefined && result !== null) {
      const endResult = result as ComplexNutrient;
      endResult.meal = 'any';
      endResult.source = 'user';
      endResult.kcal = getKcal(endResult);
      endResult.complex = endResult.complex || [];
      this._writeToCookies(endResult);
      this.exportDatabase();
      this.databaseChanged(this.data);
    }
  }
  private _writeToCookies(nut: ComplexNutrient) {
    if (nut.source === 'user') {
      const randomName = `bank:${Math.random().toString(36).substring(7)}`;
      this.nutrientBank.push(randomName);
      this._cookieService.set('nutrientBank', JSON.stringify(this.nutrientBank));
      this._cookieService.set(randomName, JSON.stringify(nut));
      this.data.push(nut);
      console.log(`added ${randomName} to cookie`);
    }
  }

  ngOnInit(): void { }

  public focusData() {
    this.onFocusEvent.emit(['Nutrient Bank', this.data]);
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
    this._dialog.open(ComposeComplexDialogComponent, {
      width: '500px',
      data: {
        source: this.data as ComplexReadContainer,
      },
    })
      .afterClosed()
      .subscribe((result: ComplexNutrient) => {
        this._createNewNutrient(result);
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
    this.nutrientBank.forEach((cookieName) => this._cookieService.delete(cookieName));
    this._cookieService.delete('nutrientBank');
    window.location.reload();
  }

}
