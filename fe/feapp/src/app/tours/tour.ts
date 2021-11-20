import { Truck } from '../trucks-overview/trucks-list/truck';
import { Depot } from '../locations/depots/depot';
import { OrderWithCustomer } from '../orders/order';

export class Tour {
  id: number;
  truck: number;
  depot: number;
  order_set: number[];
}

export class TourLocations {
  id: number;
  truck: Truck;
  depot: Depot;
  order_set: OrderWithCustomer[];
}

export class RecalculateToursResponse {
  num_deleted_tours: number;
  num_pending_orders: number;
  num_created_tours: number;
  num_pending_orders_beyond_capacity_limit: number;
}

export class TrucksToursMatchResponse {
  num_pending_tours: number;
  num_idle_trucks: number;
  num_assigned_tours: number;
}
