import { Component, OnInit, ViewChild } from '@angular/core';
import { TrucksComponent } from './trucks-list/trucks.component';
import { TrucksMapComponent } from './trucks-map/trucks-map.component';

@Component({
  selector: 'app-trucks-overview',
  templateUrl: './trucks-overview.component.html',
  styleUrls: ['./trucks-overview.component.css'],
})
export class TrucksOverviewComponent implements OnInit {
  @ViewChild(TrucksComponent) trucksList: TrucksComponent;
  @ViewChild(TrucksMapComponent) trucksMap: TrucksMapComponent;

  constructor() {}

  ngOnInit(): void {}

  onMapOpened(): void {
    if (this.trucksMap) {
      // first opening during init
      this.trucksMap.ngOnInit();
    }
  }

  onListOpened(): void {
    this.trucksList.ngOnInit();
  }
}
