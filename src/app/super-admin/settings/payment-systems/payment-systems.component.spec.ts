import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSystemsComponent } from './payment-systems.component';

describe('PaymentSystemsComponent', () => {
  let component: PaymentSystemsComponent;
  let fixture: ComponentFixture<PaymentSystemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentSystemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSystemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
