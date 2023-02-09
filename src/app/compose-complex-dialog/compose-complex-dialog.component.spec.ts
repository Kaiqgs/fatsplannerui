import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposeComplexDialogComponent } from './compose-complex-dialog.component';

describe('ComposeComplexDialogComponent', () => {
  let component: ComposeComplexDialogComponent;
  let fixture: ComponentFixture<ComposeComplexDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComposeComplexDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComposeComplexDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
