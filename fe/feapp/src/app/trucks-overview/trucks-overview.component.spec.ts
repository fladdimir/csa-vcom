import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrucksOverviewComponent } from './trucks-overview.component';

describe('TrucksOverviewComponent', () => {
  let component: TrucksOverviewComponent;
  let fixture: ComponentFixture<TrucksOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrucksOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrucksOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
