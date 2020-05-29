import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdercreationComponent } from './ordercreation.component';

describe('OrdercreationComponent', () => {
  let component: OrdercreationComponent;
  let fixture: ComponentFixture<OrdercreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdercreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdercreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
