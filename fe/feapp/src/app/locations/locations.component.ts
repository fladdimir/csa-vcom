import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CustomersComponent } from './customers/customers.component';
import { DepotsComponent } from './depots/depots.component';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css'],
})
export class LocationsComponent implements OnInit {
  @ViewChild(CustomersComponent) private customerComponent: CustomersComponent;
  @ViewChild(DepotsComponent) private depotComponent: DepotsComponent;

  constructor() { }

  ngOnInit(): void { }

  onSelectedTabChange(e: MatTabChangeEvent) {
    if (e.index === 1) {
      this.customerComponent.ngOnInit();
    }
    if (e.index === 2) {
      this.depotComponent.ngOnInit();
    }
  }
}
