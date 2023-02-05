import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FatFactsComponent } from './fat-facts.component';

describe('FatFactsComponent', () => {
  let component: FatFactsComponent;
  let fixture: ComponentFixture<FatFactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FatFactsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FatFactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
