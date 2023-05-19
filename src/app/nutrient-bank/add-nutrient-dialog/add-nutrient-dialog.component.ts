import { Component, HostListener, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { coerceComplexNutrient, ComplexNutrient, ComplexReadContainer, emptyNutrient, Macronutrients } from 'src/common/models/fatfacts.model';
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

  @Input()
  public sizeLarge = false;

  private _complexNutrient: ComplexNutrient = emptyNutrient();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private _dialogRef: MatDialogRef<AddNutrientDialogComponent>
  ) {
    if (!data) data = {};
    this.sizeLarge = data.sizeLarge || false;
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
      fibers: [0],
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
      carbs: parseFloat(this.secondFormGroup.value.carbs),
      prots: parseFloat(this.secondFormGroup.value.prots),
      fats: parseFloat(this.secondFormGroup.value.fats),
      kcal: -1,
    };
    macros.kcal = getKcal(macros);
    return macros;
  }

  get complexNutrient(): ComplexNutrient {
    const data = {
      name: this.firstFormGroup.value.name,
      unit: this.firstFormGroup.value.unit,
      amount: this.firstFormGroup.value.amount,
      ...this.macros,
      meal: "Other",
      source: "User",
      sodium: this.thirdFormGroup.value.sodium,
      fibers: this.thirdFormGroup.value.fibers,
      complex: this._complexNutrient.complex,
    };
    return coerceComplexNutrient(data);
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
      fibers: nutrient.fibers,
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
