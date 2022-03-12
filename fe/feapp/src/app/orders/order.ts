import { Customer } from '../locations/customers/customer';

class BaseOrder {
  id: number;

  creation_date: Date;
  weight: number;

  tour: number;
  rank: number;

  is_delivered: boolean;
}

export class Order extends BaseOrder {
  public static of(orderWithCustomer: OrderWithCustomer): Order {
    const order = new Order();
    order.creation_date = orderWithCustomer.creation_date;
    order.customer = orderWithCustomer.customer.id;
    order.id = orderWithCustomer.id;
    order.is_delivered = orderWithCustomer.is_delivered;
    order.rank = orderWithCustomer.rank;
    order.tour = orderWithCustomer.tour;
    order.weight = orderWithCustomer.weight;
    return order;
  }
  customer: number;
}

export class OrderWithCustomer extends BaseOrder {
  customer: Customer;
}
