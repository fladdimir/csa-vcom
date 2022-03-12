from typing import Dict

from casymda.blocks.block_components import VisualizableBlock

from .drive_to_customer import DriveToCustomer
from .entities import Truck


class OrderDeliveredGateway(VisualizableBlock):

    successor_dict: Dict = {}

    def actual_processing(self, entity):
        yield self.env.timeout(0)

    def find_successor(self, entity: Truck):
        if not self.successor_dict:
            self.populate_successor_dict()
        tour_status = self.check_tour_status(entity)
        return self.successor_dict[tour_status]

    def check_tour_status(self, entity: Truck):
        tour_completed = all(
            map(lambda o: o["is_delivered"], entity.tour_dict["order_set"])
        )
        if tour_completed:
            return "tour_finished"
        else:
            return "next_customer"

    def populate_successor_dict(self):
        # assumes 2 successors: DriveToCustomer + other
        for block in self.successors:
            if isinstance(block, DriveToCustomer):
                key = "next_customer"
            else:
                key = "tour_finished"
            self.successor_dict[key] = block
