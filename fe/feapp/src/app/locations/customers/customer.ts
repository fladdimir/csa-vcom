import { Location } from '../location';
import { Order } from '../../orders/order';

export class Customer {
    id: number;
    name: string;
    location: Location;
    order_set: Order[];
}
