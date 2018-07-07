import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailedComponent } from './event-detailed.component';

describe('EventDetailedComponent', () => {
  let component: EventDetailedComponent;
  let fixture: ComponentFixture<EventDetailedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventDetailedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
