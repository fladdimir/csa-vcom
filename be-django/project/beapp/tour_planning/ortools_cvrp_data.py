import timeit
from typing import Any, Dict, List, Tuple

from django.db.models import Max

from ..models import Depot, Location, Order, Route, Truck


def create_data_model(
    orders: List[Order],
) -> Tuple[Dict[str, Any], Dict[int, Depot], Dict[int, Order]]:
    data = {}

    # assume homogenous fleet
    max_truck_capacity = Truck.objects.aggregate(Max("capacity"))["capacity__max"]

    depots = Depot.objects.all().select_related("location")
    num_depots = len(depots)

    data["num_vehicles"] = len(orders) * num_depots
    # (target function will minimize num of needed vehicles if useful)
    data["vehicle_capacities"] = [
        max_truck_capacity for _ in range(data["num_vehicles"])
    ]

    # starts / ends
    starts = [idx for idx in range(len(depots)) for _ in range(len(orders))]
    data["start"] = starts
    data["end"] = starts

    data["demands"] = [0 for _ in range(num_depots)] + [
        order.weight for order in orders
    ]

    depot_locations = [depot.location for depot in depots]
    idx_depots = {idx: depot for idx, depot in enumerate(depots)}

    order_locations = [order.customer.location for order in orders]
    locations: List[Location] = depot_locations + order_locations
    idx_orders = {idx + len(depot_locations): order for idx, order in enumerate(orders)}

    routes: List[Route] = list(
        Route.objects.filter(from_loc__in=locations)
        .filter(to_loc__in=locations)
        .select_related("from_loc")
        .select_related("to_loc")
    )

    loc_range = range(len(locations))
    distance_matrix = [[0 for _ in loc_range] for _ in loc_range]

    location_idxs = {loc_id: [] for loc_id in set(map(lambda loc: loc.id, locations))}
    for idx, loc in enumerate(locations):
        location_idxs[loc.id].append(idx)

    for route in routes:
        from_loc_id = route.from_loc.id
        to_loc_id = route.to_loc.id
        from_loc_idxs = location_idxs[from_loc_id]
        to_loc_idxs = location_idxs[to_loc_id]
        distance = route.duration_sec
        for from_loc_idx in from_loc_idxs:
            for to_loc_idx in to_loc_idxs:
                distance_matrix[from_loc_idx][to_loc_idx] = distance

    data["distance_matrix"] = distance_matrix
    return data, idx_depots, idx_orders
