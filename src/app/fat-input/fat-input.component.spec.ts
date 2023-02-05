import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FatInputComponent } from './fat-input.component';

describe('FatInputComponent', () => {
  let component: FatInputComponent;
  let fixture: ComponentFixture<FatInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FatInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FatInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
