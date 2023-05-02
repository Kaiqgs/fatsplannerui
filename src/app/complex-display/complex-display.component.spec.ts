import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplexDisplayComponent } from './complex-display.component';

describe('ComplexDisplayComponent', () => {
  let component: ComplexDisplayComponent;
  let fixture: ComponentFixture<ComplexDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplexDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplexDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
