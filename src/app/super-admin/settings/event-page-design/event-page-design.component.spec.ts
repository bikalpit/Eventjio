import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventPageDesignComponent } from './event-page-design.component';

describe('EventPageDesignComponent', () => {
  let component: EventPageDesignComponent;
  let fixture: ComponentFixture<EventPageDesignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventPageDesignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventPageDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
