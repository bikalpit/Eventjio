import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButttonAndLinksComponent } from './buttton-and-links.component';

describe('ButttonAndLinksComponent', () => {
  let component: ButttonAndLinksComponent;
  let fixture: ComponentFixture<ButttonAndLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButttonAndLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButttonAndLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
