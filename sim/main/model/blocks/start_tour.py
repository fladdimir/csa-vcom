from typing import Dict, List
from casymda.blocks.block_components import VisualizableBlock

from .entities import Truck
from .request import do_post, do_get


class StartTour(VisualizableBlock):

    ASSIGN_TOURS_PATH = "/match-tours-and-trucks/"
    TRUCK_PATH = "/trucks/"
    TOUR_PATH = "/tour-locations/"

    def __init__(
        self, env, name, block_capacity=float("inf"), xy=(0, 0), ways={},
    ):
        super().__init__(env, name, block_capacity=block_capacity, xy=xy, ways=ways)

    def actual_processing(self, entity: Truck):
        self.match_tours_and_trucks()
        self.set_assigned_tour(entity)
        yield self.env.timeout(0)

    def set_assigned_tour(self, entity: Truck):
        truck_path = self.TRUCK_PATH + str(entity.truck_id)
        response = do_get(truck_path)
        tour_id = response["tour"]
        tour_path = self.TOUR_PATH + str(tour_id)
        entity.tour_dict = do_get(tour_path)
        orders: List[Dict] = entity.tour_dict["order_set"]
        orders.sort(key=lambda o: o["rank"])

    def match_tours_and_trucks(self):
        response = do_post(self.ASSIGN_TOURS_PATH, {})
        num_assigned_tours = response["num_assigned_tours"]
        print(f"successfully assigned {num_assigned_tours} tours")
