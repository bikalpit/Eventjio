import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewEventsComponent } from './preview-events.component';

describe('PreviewEventsComponent', () => {
  let component: PreviewEventsComponent;
  let fixture: ComponentFixture<PreviewEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
