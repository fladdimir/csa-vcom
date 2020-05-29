import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Order, OrderWithCustomer } from '../orders/order';
import { OrderService } from '../orders/order.service';
import { Truck } from '../trucks-overview/trucks-list/truck';
import { TruckService } from '../trucks-overview/trucks-list/trucks.service';
import { TourLocations } from './tour';

@Component({
  selector: 'app-tours',
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.css'],
})
export class ToursComponent implements OnInit {
  tourLocation: TourLocations;

  displayedColumns: string[] = [
    'id',
    'customer',
    'creation_date',
    'weight',
    'is_delivered',
  ];

  changeHappened = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: TourLocations,
    private orderService: OrderService,
    private truckService: TruckService
  ) {
    this.tourLocation = data;
  }

  ngOnInit(): void {}

  onCheckBoxChange(orderWithCustomer: OrderWithCustomer): void {
    const order = Order.of(orderWithCustomer);
    this.orderService.updateOrder(order).subscribe(
      (order) => {
        this.changeHappened = true;
      },
      (error) => {
        alert('order update failed: ' + JSON.stringify(error, undefined, 4));
      }
    );
  }

  onCancelTour(): void {
    const truck: Truck = this.tourLocation.truck;
    truck.tour = null;
    this.truckService.update(truck).subscribe(
      (updatedTruck) => {
        alert('tour unassigned');
        this.tourLocation.truck = null;
        this.changeHappened = true;
      },
      (error) =>
        alert(
          'error during tour udpate: ' + JSON.stringify(error, undefined, 4)
        )
    );
  }
}
