import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Customer } from '../../locations/customers/customer';
import { CustomerService } from '../../locations/customers/customers.service';
import { Order } from '../../orders/order';

interface CustomerIdData {
  customerId: number;
}

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css'],
})
export class CustomerDetailComponent implements OnInit {
  customer: Customer;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: CustomerIdData,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.customerService
      .findOne(this.data.customerId)
      .subscribe((customer) => (this.customer = customer));
  }

  getPendingOrders(): Order[] {
    return this.customer.order_set.filter((o) => !o.is_delivered);
  }
}
