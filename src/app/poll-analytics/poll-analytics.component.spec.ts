import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollAnalyticsComponent } from './poll-analytics.component';

describe('PollAnalyticsComponent', () => {
  let component: PollAnalyticsComponent;
  let fixture: ComponentFixture<PollAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PollAnalyticsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
