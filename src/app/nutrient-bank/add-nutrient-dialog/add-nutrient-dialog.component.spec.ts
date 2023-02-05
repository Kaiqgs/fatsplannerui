import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNutrientDialogComponent } from './add-nutrient-dialog.component';

describe('AddNutrientDialogComponent', () => {
  let component: AddNutrientDialogComponent;
  let fixture: ComponentFixture<AddNutrientDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNutrientDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNutrientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
