import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Order } from '../orders/order';
import { OrderService } from './order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  @Input() orders: Order[];

  @Output() orderDeleted: EventEmitter<Order> = new EventEmitter<Order>();

  displayedColumns: string[] = [
    'id',
    'creation_date',
    'weight',
    'tour',
    'is_delivered',
    'deleteOrder',
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {}

  deleteOrder(order: Order) {
    this.orderService.deleteOrder(order).subscribe(
      () => {
        this.orderDeleted.emit(order);
      },
      (error) =>
        alert(
          `Deletion of order ${order.id} failed with error:\n` +
            JSON.stringify(error, undefined, 4)
        )
    );
  }
}
