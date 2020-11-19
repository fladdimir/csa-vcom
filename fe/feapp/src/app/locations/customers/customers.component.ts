import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Order } from '../../orders/order';
import { Customer } from './customer';
import { CustomerService } from './customers.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
})
export class CustomersComponent implements OnInit {
  customers: Observable<Customer[]>;

  displayedColumns: string[] = [
    'id',
    'name',
    'lat',
    'lon',
    'num_completed',
    'num_pending',
  ];
  customersDataSource = new MatTableDataSource<Customer>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.customers = this.customerService.findAll();

    this.customersDataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'num_completed':
          return this.getNumCompletedOrders(item.order_set);
        case 'num_pending':
          return this.getNumPendingOrders(item.order_set);
        default:
          return item[property];
      }
    };

    this.customersDataSource.sort = this.sort;
    this.customers.subscribe(
      (trucks) => (this.customersDataSource.data = trucks)
    );
  }

  getNumCompletedOrders(orders: Order[]): number {
    return orders.filter((o) => o.is_delivered).length;
  }

  getNumPendingOrders(orders: Order[]): number {
    return orders.filter((o) => !o.is_delivered).length;
  }
}
