import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitilistSignupComponent } from './waitilist-signup.component';

describe('WaitilistSignupComponent', () => {
  let component: WaitilistSignupComponent;
  let fixture: ComponentFixture<WaitilistSignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitilistSignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitilistSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
