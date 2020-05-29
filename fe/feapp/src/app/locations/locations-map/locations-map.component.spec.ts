import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationsMapComponent } from './locations-map.component';

describe('LocationsMapComponent', () => {
  let component: LocationsMapComponent;
  let fixture: ComponentFixture<LocationsMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationsMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
