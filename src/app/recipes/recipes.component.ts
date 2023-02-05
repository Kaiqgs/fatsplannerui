import { Recipe } from 'src/common/models/recipe.model';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import FileSaver from 'file-saver';
import { FatsecretContainerContainer } from 'src/common/models/fatfacts.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { ToastrService } from 'ngx-toastr';

export interface AddRecipeCallback {
  (data: FatsecretContainerContainer): void;
}

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
})
export class RecipesComponent implements OnInit {
  recipes: Array<Recipe> = [];

  @ViewChild('openInput')
  openInput!: ElementRef<HTMLElement>;

  @Input()
  selectedFacts: FatsecretContainerContainer = [];

  @Output()
  onAddRecipe = new EventEmitter<AddRecipeCallback>();

  constructor(private _dialog: MatDialog, private _toaster: ToastrService) {}

  ngOnInit(): void {}

  addRecipe() {
    this.onAddRecipe.emit((data: FatsecretContainerContainer) => {
      console.log(data);
      if (data?.length > 0) {
        const newdiag = this._dialog.open(AddDialogComponent);
        newdiag.afterClosed().subscribe({
          next: (name) => {
            
            if (name === null) {
              return;
            } else if (name === '') {
              this._toaster.error('Empty input not allowed', 'Empty error');
              return;
            } else if (this.recipes.find((x) => x.name == name)) {
              this._toaster.warning(
                `Duplicate recipe: ${name}.`,
                'dupe recipe'
              );
              return;
            } else {
              this.recipes.push({
                data: this.selectedFacts.flat(),
                name: name,
                compute: undefined,
              });
            }
          },
          error: (err) => {
            console.log(err);
          },
        });
      } else {
        this._toaster.warning('Nothing selected', 'Selection Error');
      }
    });
  }

  export() {
    const json = JSON.stringify(this.recipes);
    const blob = new Blob([json], { type: 'text/json;chaset=utf-8' });
    FileSaver.saveAs(blob, 'recipes.fats');
  }

  openAttempt() {
    this.openInput.nativeElement.click();
  }

  onInputOpened(event: Event) {
    const ele = event.target as HTMLInputElement;
    const files = ele.files as FileList;
    const file = files[0];
    const fr = new FileReader();
    fr.onloadend = (fileee) => {
      this.recipes = JSON.parse((fileee.target?.result as string) || '[]');
    };
    fr.readAsText(file);
    console.log();
  }
}
