import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCreationFormComponent } from './customer-creation-form.component';

describe('CustomerCreationFormComponent', () => {
  let component: CustomerCreationFormComponent;
  let fixture: ComponentFixture<CustomerCreationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerCreationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
