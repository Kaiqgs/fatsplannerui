import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FatInputComponent } from './fat-input/fat-input.component';
import { CommonModule } from '@angular/common';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { FatFactsComponent } from './fat-facts/fat-facts.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MultiTableViewComponent } from './fat-facts/multi-table-view/multi-table-view.component';
import { RecipesComponent } from './recipes/recipes.component';
import { TableComponent } from './fat-facts/table/table.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AddDialogComponent } from './recipes/add-dialog/add-dialog.component';
import { ToastrModule } from 'ngx-toastr';
import { OverviewComponent } from './overview/overview.component';
import { PersistComponent } from './persist/persist.component';
import { CookieService } from 'ngx-cookie-service';
import { DiaryComponent } from './diary/diary.component';
import { NutrientBankComponent } from './nutrient-bank/nutrient-bank.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MacrosBarComponent } from './macros-bar/macros-bar.component';
import { AddNutrientDialogComponent } from './nutrient-bank/add-nutrient-dialog/add-nutrient-dialog.component';
import { MatStepperModule } from '@angular/material/stepper';
import { HttpClientModule } from '@angular/common/http';
import { MacroMatchDialogComponent } from './macro-match-dialog/macro-match-dialog.component';
import { ComposeComplexDialogComponent } from './compose-complex-dialog/compose-complex-dialog.component';
import { FactInspectComponent } from './fact-inspect/fact-inspect.component';
import { ComplexDisplayComponent } from './complex-display/complex-display.component';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    FatInputComponent,
    ToolbarComponent,
    FatFactsComponent,
    MultiTableViewComponent,
    RecipesComponent,
    TableComponent,
    AddDialogComponent,
    OverviewComponent,
    PersistComponent,
    DiaryComponent,
    NutrientBankComponent,
    MacrosBarComponent,
    AddNutrientDialogComponent,
    MacroMatchDialogComponent,
    ComposeComplexDialogComponent,
    FactInspectComponent,
    ComplexDisplayComponent,
  ],
  imports: [

    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatStepperModule,
    HttpClientModule,
    //NgbModule,
    MatTabsModule,
    MatDialogModule,
    ToastrModule.forRoot(),
    CommonModule,
    MatNativeDateModule,
    MatDatepickerModule
  ],
  providers: [CookieService, MatDatepickerModule],
  bootstrap: [AppComponent],
})
export class AppModule { }
