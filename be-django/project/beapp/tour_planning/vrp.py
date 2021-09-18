import timeit

from ..models import Tour
from typing import List

from ..models import Order

from .ortools_cvrp import main

from .ortools_cvrp_data import create_data_model


def create_tours(orders: List[Order]) -> int:
    if len(orders) == 0:
        return 0

    start_time = timeit.default_timer()
    data, idx_depots, idx_orders = create_data_model(orders)
    time_needed_for_data_collection = timeit.default_timer() - start_time

    start_time = timeit.default_timer()

    data, manager, routing, solution = main(data)

    time_needed = timeit.default_timer() - start_time

    if solution:
        tours = evaluate_solution(data, manager, routing, solution)
        print("tours:")
        print(tours)
        print(f"time needed for data collection: {time_needed_for_data_collection}")
        print(f"time needed for tour-optimization: {time_needed}")
        return create_tour_objects(tours, idx_depots, idx_orders)
    return 0


def create_tour_objects(tours, idx_depots, idx_orders) -> int:
    for tour in tours:
        depot = idx_depots[tour[0]]
        tour_object = Tour(depot=depot)
        tour_object.save()
        for idx, order_node_id in enumerate(tour[1:-1]):
            order = idx_orders[order_node_id]
            order.tour = tour_object
            order.rank = idx + 1
            order.save()
    return len(tours)


def evaluate_solution(data, manager, routing, solution) -> List[List[int]]:
    # print_solution(data, manager, routing, solution)
    return get_tours(data, manager, routing, solution)


def get_tours(data, manager, routing, solution) -> List[List[int]]:
    tours = []
    """Prints solution on console."""

    for vehicle_id in range(data["num_vehicles"]):
        tour = []

        index = routing.Start(vehicle_id)
        while not routing.IsEnd(index):
            node_index = manager.IndexToNode(index)
            tour.append(node_index)
            index = solution.Value(routing.NextVar(index))
        last_node_index = manager.IndexToNode(index)
        tour.append(last_node_index)
        if len(tour) > 2:
            tours.append(tour)
    return tours


def print_solution(data, manager, routing, solution):
    """Prints solution on console."""
    total_distance = 0
    total_load = 0
    for vehicle_id in range(data["num_vehicles"]):

        index = routing.Start(vehicle_id)
        plan_output = "Route for vehicle {}:\n".format(vehicle_id)
        route_distance = 0
        route_load = 0
        while not routing.IsEnd(index):
            node_index = manager.IndexToNode(index)
            route_load += data["demands"][node_index]
            plan_output += " {0} Load({1}) -> ".format(node_index, route_load)
            previous_index = index
            index = solution.Value(routing.NextVar(index))
            route_distance += routing.GetArcCostForVehicle(
                previous_index, index, vehicle_id
            )
        plan_output += " {0} Load({1})\n".format(manager.IndexToNode(index), route_load)
        plan_output += "Distance of the route: {}m\n".format(route_distance)
        plan_output += "Load of the route: {}\n".format(route_load)
        print(plan_output)
        total_distance += route_distance
        total_load += route_load
    print("Total distance of all routes: {}m".format(total_distance))
    print("Total load of all routes: {}".format(total_load))
