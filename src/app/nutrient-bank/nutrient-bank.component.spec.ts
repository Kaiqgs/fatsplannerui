import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutrientBankComponent } from './nutrient-bank.component';

describe('NutrientBankComponent', () => {
  let component: NutrientBankComponent;
  let fixture: ComponentFixture<NutrientBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NutrientBankComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NutrientBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
