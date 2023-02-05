import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-nutrient-dialog',
  templateUrl: './add-nutrient-dialog.component.html',
  styleUrls: ['./add-nutrient-dialog.component.scss'],
})
export class AddNutrientDialogComponent {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _dialogRef: MatDialogRef<AddNutrientDialogComponent>
  ) {
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
  }

  onSubmit() {
    this._dialogRef.close({
      ...this.firstFormGroup.value,
      ...this.secondFormGroup.value,
      ...this.thirdFormGroup.value,
    });
  }
}
