# check whether tours are left to be executed
# -> StartTour / other

from main.model.blocks.start_tour import StartTour
from typing import Dict
from casymda.blocks.block_components import VisualizableBlock

from .entities import Truck
from .request import do_patch, do_post


class TourDoneGateway(VisualizableBlock):

    TRUCK_PATH = "/trucks/"
    TOUR_PATH = "/recalculate-pending-tours/"

    successor_dict: Dict = {}

    def actual_processing(self, entity):

        self.unassign_tour(entity)

        yield self.env.timeout(0)  # time for a short break before the next tour

    def find_successor(self, entity: Truck):
        if not self.successor_dict:
            self.populate_successor_dict()
        tour_status = self.check_tours_status(entity)

        return self.successor_dict[tour_status]

    def check_tours_status(self, entity: Truck):
        tours_left = self.num_pending_tours()
        if tours_left > 0:
            return "next_tour"
        else:
            return "nothing_left_to_do"

    def populate_successor_dict(self):
        # assumes 2 successors: StartTour + other
        for block in self.successors:
            if isinstance(block, StartTour):
                key = "next_tour"
            else:
                key = "nothing_left_to_do"
            self.successor_dict[key] = block

    def unassign_tour(self, entity: Truck):
        path = self.TRUCK_PATH + str(entity.truck_id) + "/"
        body = {"tour": None}
        do_patch(path, body)
        entity.tour_dict = None

    def num_pending_tours(self) -> int:
        result = do_post(self.TOUR_PATH, {})
        num_created_tours = result["num_created_tours"]
        print(f"successfully created {num_created_tours} tours")
        return num_created_tours
