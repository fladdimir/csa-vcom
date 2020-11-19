import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrucksMapComponent } from './trucks-map.component';

describe('TrucksMapComponent', () => {
  let component: TrucksMapComponent;
  let fixture: ComponentFixture<TrucksMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrucksMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrucksMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
