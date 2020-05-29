import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrucksCreationFormComponent } from './trucks-creation-form.component';

describe('TrucksCreationFormComponent', () => {
  let component: TrucksCreationFormComponent;
  let fixture: ComponentFixture<TrucksCreationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrucksCreationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrucksCreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
