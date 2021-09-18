import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourPlanningComponent } from './tour-planning.component';

describe('MapComponent', () => {
  let component: TourPlanningComponent;
  let fixture: ComponentFixture<TourPlanningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TourPlanningComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
