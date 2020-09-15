import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuedTicketComponent } from './issued-ticket.component';

describe('IssuedTicketComponent', () => {
  let component: IssuedTicketComponent;
  let fixture: ComponentFixture<IssuedTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuedTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuedTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
