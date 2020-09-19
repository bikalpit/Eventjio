import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventAndTicketTypesComponent } from './event-and-ticket-types.component';

describe('EventAndTicketTypesComponent', () => {
  let component: EventAndTicketTypesComponent;
  let fixture: ComponentFixture<EventAndTicketTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventAndTicketTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventAndTicketTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
