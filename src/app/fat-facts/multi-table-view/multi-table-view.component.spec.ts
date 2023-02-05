import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiTableViewComponent } from './multi-table-view.component';

describe('MultiTableViewComponent', () => {
  let component: MultiTableViewComponent;
  let fixture: ComponentFixture<MultiTableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiTableViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
