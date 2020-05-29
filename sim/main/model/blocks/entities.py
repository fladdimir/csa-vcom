from typing import Dict, Optional

from casymda.blocks import Entity


class Customer(Entity):
    customer_id: int


class Coords:
    def __init__(self, lat=1.0, lon=1.0) -> None:
        self.lat = lat
        self.lon = lon


class Truck(Entity):

    truck_id: int
    coords: Coords
    tour_dict: Optional[Dict]
