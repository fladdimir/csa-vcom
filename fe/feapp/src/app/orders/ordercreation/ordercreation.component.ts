import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Order } from '../order';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-ordercreation',
  templateUrl: './ordercreation.component.html',
  styleUrls: ['./ordercreation.component.css'],
})
export class OrdercreationComponent implements OnInit {
  @Input() customerId: number;
  @Output() orderCreated: EventEmitter<Order> = new EventEmitter<Order>();

  weight: number;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {}

  createOrder(): void {
    const order = new Order();
    order.customer = this.customerId;
    order.weight = this.weight;
    this.orderService.createOrder(order).subscribe((createdOrder) => {
      this.weight = null;
      this.orderCreated.emit(createdOrder);
    });
  }
}
