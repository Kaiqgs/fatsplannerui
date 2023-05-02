import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactInspectComponent } from './fact-inspect.component';

describe('FactInspectComponent', () => {
  let component: FactInspectComponent;
  let fixture: ComponentFixture<FactInspectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactInspectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactInspectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
