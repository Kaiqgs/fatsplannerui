import { Component, HostListener, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComplexNutrient, ComplexReadContainer, emptyNutrient, Macronutrients } from 'src/common/models/fatfacts.model';
import { getKcal } from 'src/common/models/thermodynamics';

@Component({
  selector: 'app-add-nutrient-dialog',
  templateUrl: './add-nutrient-dialog.component.html',
  styleUrls: ['./add-nutrient-dialog.component.scss'],
})
export class AddNutrientDialogComponent {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  complexFormGroup: FormGroup;
  source: ComplexReadContainer;

  private _complexNutrient: ComplexNutrient = emptyNutrient();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private _dialogRef: MatDialogRef<AddNutrientDialogComponent>
  ) {
    if (!data) data = {};
    this.source = data.source || [];
    this.firstFormGroup = this._formBuilder.group({
      name: [''],
      unit: [''],
      amount: [0],
    });
    this.secondFormGroup = this._formBuilder.group({
      carbs: [0],
      prots: [0],
      fats: [0],
    });
    this.thirdFormGroup = this._formBuilder.group({
      sodium: [0],
      fiber: [0],
    });
    this.complexFormGroup = this._formBuilder.group({});
  }

  onSubmit() {
    this._dialogRef.close(
      this.complexNutrient
    );
  }


  get macros(): Macronutrients {
    let macros = {
      carbs: this.secondFormGroup.value.carbs as number,
      prots: this.secondFormGroup.value.prots as number,
      fats: this.secondFormGroup.value.fats as number,
      kcal: -1,
    };
    macros.kcal = getKcal(macros);
    return macros;
  }

  get complexNutrient(): ComplexNutrient {
    return {
      name: this.firstFormGroup.value.name as string,
      unit: this.firstFormGroup.value.unit as string,
      amount: this.firstFormGroup.value.amount as number,
      ...this.macros,
      meal: "Other",
      source: "User",
      sodium: this.thirdFormGroup.value.sodium as number,
      fiber: this.thirdFormGroup.value.fiber as number,
      complex: this._complexNutrient.complex,
    };
  }

  onComplexUpdate(nutrient: ComplexNutrient) {
    this.firstFormGroup.patchValue({
      name: nutrient.name,
      unit: nutrient.unit,
      amount: nutrient.amount,
    });

    this.secondFormGroup.patchValue({
      carbs: nutrient.carbs,
      prots: nutrient.prots,
      fats: nutrient.fats,
    });

    this.thirdFormGroup.patchValue({
      sodium: nutrient.sodium,
      fiber: nutrient.fiber,
    });
    this._complexNutrient = nutrient;
  }

  @HostListener('keydown', ['$event'])
  preventEnter(event: KeyboardEvent) {
    if (event.key === "Enter" && this.source.length) {
      event.preventDefault();
    }
  }

  @HostListener('document:keydown.shift.s', ['$event'])
  onShiftS(event: KeyboardEvent) {
    event.preventDefault();
    this._dialogRef.close(this.complexNutrient);
  }
}
