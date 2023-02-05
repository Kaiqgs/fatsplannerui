import { Component, EventEmitter, Output } from '@angular/core';
import {
  FatsecretContainer,
  FatsecretData,
} from 'src/common/models/fatfacts.model';
import { LocalBankAsset } from 'src/app/nutrient-bank/nutrient-bank.taco';
import { Focusable } from '../app.component';
import { CookieService } from 'ngx-cookie-service';
import { AddNutrientDialogComponent } from './add-nutrient-dialog/add-nutrient-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { getKcal } from 'src/common/models/thermodynamics';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-nutrient-bank',
  templateUrl: './nutrient-bank.component.html',
  styleUrls: ['./nutrient-bank.component.scss'],
})
export class NutrientBankComponent {
  @Output()
  public onFocusEvent = new EventEmitter<Focusable>();

  @Output()
  public databaseChange = new EventEmitter<FatsecretContainer>();

  public data: FatsecretContainer = [];
  constructor(
    private _cookieService: CookieService,
    private _dialog: MatDialog,
    private _http: HttpClient
  ) {
    //read from cookies otherwise load Taco
    console.log(this.data);
    if (this._cookieService.check('nutrientBank')) {
      this.data = JSON.parse(this._cookieService.get('nutrientBank'));
      this.databaseChanged(this.data);
    } else {
      new LocalBankAsset()
        .readData(this._http)
        .then((data) => {
          this.data = data;
          this.databaseChanged(this.data);
        })
        .catch((err) => {
          this.data = JSON.parse(this._cookieService.get('nutrientBank'));
          this.databaseChanged(this.data);
        });
    }
  }

  ngOnInit(): void {}

  public focusData() {
    this.onFocusEvent.emit(['Nutrient Bank', this.data]);
  }

  //on database change, emit the new database;
  public databaseChanged(event: FatsecretContainer) {
    //export to cookies
    this._cookieService.set('nutrientBank', JSON.stringify(event));
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
      .subscribe((result: FatsecretData) => {
        if (result !== undefined) {
          result.meal = 'any';
          result.source = 'user';
          result.kcal = getKcal(result);
          this.data.push(result);
          this.exportDatabase();
          this.databaseChanged(this.data);
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
    this._cookieService.delete('nutrientBank');
    window.location.reload();
  }
}
