from typing import Dict

from .drive_route import DriveRoute
from .entities import Coords, Truck


class DriveToCustomer(DriveRoute):
    def actual_processing(self, entity: Truck):
        next_order: Dict = next(
            filter(lambda o: not o["is_delivered"], entity.tour_dict["order_set"])
        )
        next_customer_loc = next_order["customer"]["location"]
        lat = next_customer_loc["lat"]
        lon = next_customer_loc["lon"]

        from_point = entity.coords
        to_point = Coords(lat, lon)
        yield self.env.process(self.drive(entity, from_point, to_point))
