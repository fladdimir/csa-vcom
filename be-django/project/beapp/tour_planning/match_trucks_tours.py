from typing import Dict, List

from django.db.models import Min, Aggregate, BooleanField
from geopy.distance import distance
from ortools.graph import pywrapgraph

from ..models import *


from django.conf import settings


def is_postgres():
    return "postgres" in settings.DATABASES["default"]["ENGINE"]


class BoolAnd(Aggregate):
    function = "BOOL_AND"
    output_field = BooleanField()


def find_unfinished_tours():
    return (
        list(
            Tour.objects.filter(truck__isnull=True)
            .annotate(is_finished=BoolAnd("order__is_delivered"))
            .exclude(is_finished=True)
        )
        if is_postgres()
        else list(  # sqlite way:
            Tour.objects.filter(truck__isnull=True)
            .annotate(is_finished=Min("order__is_delivered"))
            .exclude(is_finished=1)
        )
    )


def match_trucks_and_tours() -> Dict[str, int]:
    # get all idle trucks
    trucks: List[Truck] = Truck.objects.filter(tour__isnull=True)
    # get all pending tours (without assigned truck, not yet started)
    tours: List[Tour] = find_unfinished_tours()
    result_dict = {
        "num_pending_tours": len(tours),
        "num_idle_trucks": len(trucks),
        "num_assigned_tours": 0,
    }
    if len(tours) == 0 or len(trucks) == 0:
        return result_dict
    # create assignment cost matrix: trucks -> tours (depots)
    distances = calculate_truck_depot_distances(trucks, tours)
    # solve + return kpi
    assignments_idxs = assign(distances)
    assignments = {}
    for key, val in assignments_idxs.items():
        truck_idx = key - 1
        tour_idx = val - (len(trucks) + 1)
        assignments[trucks[truck_idx]] = tours[tour_idx]
    print(assignments)
    for truck, tour in assignments.items():
        truck.tour = tour
        truck.save()
    result_dict["num_assigned_tours"] = len(assignments)
    return result_dict


def calculate_truck_depot_distances(
    trucks: List[Truck], tours: List[Tour]
) -> List[List[int]]:
    distances = []
    for truck in trucks:
        truck_pos = (truck.lat, truck.lon)
        t_distances = []
        distances.append(t_distances)
        for tour in tours:
            depot_loc: Location = tour.depot.location
            depot_pos = (depot_loc.lat, depot_loc.lon)
            # TODO: osrm table lookup of driving duration
            dist = round(distance(truck_pos, depot_pos).meters)
            t_distances.append(dist)
    return distances


def assign(distances: List[List[int]]) -> Dict[int, int]:
    # sample input: [[tr1 -> depots], [tr2 -> depots], ...]
    source_idx = 0
    num_trucks = len(distances)  # 2
    truck_idxs = [i + 1 for i in range(num_trucks)]  # 1, 2
    num_tours = len(distances[0])  # 3
    tour_idxs = [i + num_trucks + 1 for i in range(num_tours)]  # 3, 4, 5
    sink_idx = num_trucks + num_tours + 1  # 6

    start_nodes = (
        [source_idx for _ in truck_idxs]
        + [i for i in truck_idxs for _ in tour_idxs]
        + [i for i in tour_idxs]
    )
    end_nodes = (
        [i for i in truck_idxs]
        + [i for _ in truck_idxs for i in tour_idxs]
        + [sink_idx for _ in tour_idxs]
    )
    capacities = [1 for _ in range(len(start_nodes))]
    costs = (
        [0 for _ in range(num_trucks)]
        + [
            distances[truck][tour]
            for truck in range(num_trucks)
            for tour in range(num_tours)
        ]
        + [0 for _ in range(num_tours)]
    )
    supply = min(num_tours, num_trucks)
    supplies = [supply] + [0 for _ in range(num_trucks + num_tours)] + [-supply]

    print(start_nodes)
    print(end_nodes)
    print(capacities)
    print(costs)
    print(supplies)
    return main(
        start_nodes, end_nodes, capacities, costs, supplies, source_idx, sink_idx
    )


def main(
    start_nodes, end_nodes, capacities, costs, supplies, source, sink
) -> Dict[int, int]:
    min_cost_flow = pywrapgraph.SimpleMinCostFlow()
    # Add each arc.
    for i in range(len(start_nodes)):
        min_cost_flow.AddArcWithCapacityAndUnitCost(
            start_nodes[i], end_nodes[i], capacities[i], costs[i]
        )
    # Add node supplies.
    for i in range(len(supplies)):
        min_cost_flow.SetNodeSupply(i, supplies[i])

    result = {}
    # Find the minimum cost flow
    if min_cost_flow.Solve() == min_cost_flow.OPTIMAL:
        print("Total cost = ", min_cost_flow.OptimalCost())
        for arc in range(min_cost_flow.NumArcs()):
            # Can ignore arcs leading out of source or into sink.
            if min_cost_flow.Tail(arc) != source and min_cost_flow.Head(arc) != sink:
                # Arcs in the solution have a flow value of 1. Their start and end nodes
                # give an assignment of worker to task.
                if min_cost_flow.Flow(arc) > 0:
                    worker, task, cost = (
                        min_cost_flow.Tail(arc),
                        min_cost_flow.Head(arc),
                        min_cost_flow.UnitCost(arc),
                    )
                    result[worker] = task
                    print(f"Worker {worker} assigned to task {task}. Cost = {cost}")
    else:
        raise AssertionError("There was an issue with the min cost flow input.")
    return result
