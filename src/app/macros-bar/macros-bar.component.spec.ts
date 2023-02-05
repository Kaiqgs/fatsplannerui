import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacrosBarComponent } from './macros-bar.component';

describe('MacrosBarComponent', () => {
  let component: MacrosBarComponent;
  let fixture: ComponentFixture<MacrosBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MacrosBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MacrosBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
