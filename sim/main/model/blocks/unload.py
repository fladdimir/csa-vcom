from typing import Dict
from casymda.blocks.block_components import VisualizableBlock

from .entities import Customer, Truck
from .request import do_patch


class Unload(VisualizableBlock):

    PATH = "/orders/"

    def actual_processing(self, entity: Truck):

        order: Dict = next(
            filter(lambda o: not o["is_delivered"], entity.tour_dict["order_set"])
        )
        weight = order["weight"]
        duration = weight * (1 / 3)  # sec / unit

        yield self.env.timeout(duration)

        order_id = order["id"]
        path = self.PATH + str(order_id) + "/"
        do_patch(path, {"is_delivered": True})
        order["is_delivered"] = True
        print(f"successfully delivered order: {order_id}")
