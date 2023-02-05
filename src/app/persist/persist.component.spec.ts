import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersistComponent } from './persist.component';

describe('PersistComponent', () => {
  let component: PersistComponent;
  let fixture: ComponentFixture<PersistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
