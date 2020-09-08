import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsitesEmbedCodesComponent } from './websites-embed-codes.component';

describe('WebsitesEmbedCodesComponent', () => {
  let component: WebsitesEmbedCodesComponent;
  let fixture: ComponentFixture<WebsitesEmbedCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebsitesEmbedCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsitesEmbedCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
