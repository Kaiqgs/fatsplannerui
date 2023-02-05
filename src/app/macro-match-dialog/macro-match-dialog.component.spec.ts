import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacroMatchDialogComponent } from './macro-match-dialog.component';

describe('MacroMatchDialogComponent', () => {
  let component: MacroMatchDialogComponent;
  let fixture: ComponentFixture<MacroMatchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MacroMatchDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MacroMatchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
