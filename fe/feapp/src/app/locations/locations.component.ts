import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomersComponent } from './customers/customers.component';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css'],
})
export class LocationsComponent implements OnInit {
  @ViewChild(CustomersComponent) private customerComponent: CustomersComponent;

  constructor() {}

  ngOnInit(): void {}

  onSelectedTabChange(e: MatTabChangeEvent) {
    if (e.index === 1) {
      this.customerComponent.ngOnInit();
    }
  }
}
