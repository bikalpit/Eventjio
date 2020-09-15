import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectAppsComponent } from './connect-apps.component';

describe('ConnectAppsComponent', () => {
  let component: ConnectAppsComponent;
  let fixture: ComponentFixture<ConnectAppsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectAppsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
