import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatingChartsComponent } from './seating-charts.component';

describe('SeatingChartsComponent', () => {
  let component: SeatingChartsComponent;
  let fixture: ComponentFixture<SeatingChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeatingChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatingChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
