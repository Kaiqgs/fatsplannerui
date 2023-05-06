import { Component, ElementRef, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import fuzzysort from 'fuzzysort';
import {
  ComplexNutrient,
  ComplexWeighted,
  computeComplexMacro,
  dataFromReference,
  ComplexContainer,
  getNutrientIdentifier,
  ComplexReadContainer,
  emptyNutrient,
} from 'src/common/models/fatfacts.model';

interface ComplexSelected {
  localId: number,
  globalId: number,
  code: string,
  amount: number,
  complex: ComplexNutrient,
}


@Component({
  selector: 'app-compose-complex-dialog',
  templateUrl: './compose-complex-dialog.component.html',
  styleUrls: ['./compose-complex-dialog.component.scss'],
})
export class ComposeComplexDialogComponent {
  form: FormGroup;

  @Input()
  source: ComplexReadContainer;

  @ViewChild('nameInput')
  nameInput!: ElementRef<HTMLInputElement>;

  @Input()
  topK = 10;

  @Input()
  asModal = true;

  @Output()
  onUpdate = new EventEmitter<ComplexNutrient>();

  indexes: { [code: string]: number };
  selected: ComplexSelected[] = [];

  constructor(
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<ComposeComplexDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (!data) data = {};
    this.source = data.source || [];
    this.indexes = Object.assign(
      {},
      ...this.source.map((obj, index) => ({ [getNutrientIdentifier(obj)]: index }))
    );
    this.form = this._fb.group({});
  }

  // topk sorted;
  get sortedK(): ComplexContainer {
    if (this.nameInput == undefined) return [];

    const options = fuzzysort.go(
      this.nameInput.nativeElement.value,
      this.source,
      {
        keys: ['name'],
      }
    );
    let bestOptions = options
      .map((option) => option.obj)
      .filter((obj) =>
        !this.selected.find((s) => s.code == getNutrientIdentifier(obj))
      )
      .slice(0, this.topK - Object.keys(this.selected).length);
    return bestOptions;
  }

  onCheck(obj: ComplexNutrient, event: Event) {
    let checked = (event.target as HTMLInputElement).checked;
    let dataId = getNutrientIdentifier(obj);
    if (!checked) {
      console.warn("This should not trigger");
      return;
    }
    this.selected.push({
      code: dataId,
      globalId: this.indexes[dataId],
      localId: this.selected.length,
      amount: obj.amount,
      complex: obj,
    } as ComplexSelected);
    this.onUpdate.emit(this.macros);
  }

  deCheck(obj: ComplexSelected) {
    let index = this.selected.indexOf(obj);
    if (index == -1) {
      return;
    }
    this.selected.splice(index, 1);
    this.onUpdate.emit(this.macros);
  }

  closeDialog() {
    this._dialogRef.close();
  }

  get macros(): ComplexNutrient {
    //create Complex macronutrient from selected
    let macro: ComplexNutrient = emptyNutrient();
    let data: ComplexWeighted[] = this.selected.map((obj) =>
      [dataFromReference(obj.complex, obj.amount), 1]
    );
    macro.complex = data;
    return computeComplexMacro(macro, false);
  }

  createCloseDialog() {
    if (this.asModal) {
      this._dialogRef.close(this.macros);
    }
  }

  onAmountChange(obj: ComplexSelected, event: Event) {
    const amount = (event.target as HTMLInputElement).valueAsNumber;
    const diff = amount - obj.amount;
    if (diff == 0) {
      return;
    }
    obj.amount = amount;
    this.onUpdate.emit(this.macros);
  }


  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const bestOptions = this.sortedK;
      if (bestOptions.length > 0) {
        this.onCheck(bestOptions[0], { target: { checked: true } } as any as Event);
      }
    }
  }
}
