import timeit
from typing import Dict, List

from django.db.models import Max

from ..models import *
from .vrp import create_tours


def calculate_tours_for_pending_orders() -> Dict:
    """ calculates new tours for all orders which are not part of already started tours """
    start_time = timeit.default_timer()

    num_deleted_tours = delete_pending_tours()

    pending_orders = get_pending_orders_within_capacity_limit()

    # optimization potentials for combining queries..
    num_created_tours = create_tours(pending_orders)

    num_pending_orders_beyond_capacity_limit = count_pending_orders_beyond_capacity()

    time_needed_overall = timeit.default_timer() - start_time
    print(f"overall time needed for tour-creation: {time_needed_overall}")

    return {
        "num_deleted_tours": num_deleted_tours,
        "num_pending_orders": len(pending_orders),
        "num_created_tours": num_created_tours,
        "num_pending_orders_beyond_capacity_limit": num_pending_orders_beyond_capacity_limit,
    }


def get_pending_orders_within_capacity_limit() -> List[Order]:
    capacity_limit = Truck.objects.aggregate(Max("capacity"))["capacity__max"]
    return list(
        Order.objects.filter(tour__isnull=True)
        .filter(is_delivered=False)
        .filter(weight__lte=capacity_limit)
        .prefetch_related("customer")
        .prefetch_related("customer__location")
    )


def count_pending_orders_beyond_capacity() -> int:
    capacity_limit = Truck.objects.aggregate(Max("capacity"))["capacity__max"]
    return (
        Order.objects.filter(weight__gt=capacity_limit)
        .filter(tour__isnull=True)
        .filter(is_delivered=False)
        .count()
    )


def delete_pending_tours() -> int:
    # TODO: unassign pending orders from tours without truck + bulk delete empty tours
    _, del_dict = Tour.objects.filter(truck__isnull=True).delete()
    return del_dict.get("beapp.Tour", 0)
