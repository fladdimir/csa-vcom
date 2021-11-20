# register truck
from casymda.blocks.block_components import VisualizableBlock

from .entities import Coords, Truck
from .request import do_post


class RegisterTruck(VisualizableBlock):

    PATH = "/trucks/"

    def __init__(
        self, env, name, block_capacity=float("inf"), xy=(0, 0), ways={},
    ):
        super().__init__(env, name, block_capacity=block_capacity, xy=xy, ways=ways)
        self.truck_counter = 0

    def actual_processing(self, entity: Truck):
        self.truck_counter += 1

        self.assign_geo_coords(entity, self.truck_counter)

        self.register_truck(entity)

        yield self.env.timeout(0)

    def assign_geo_coords(self, entity: Truck, counter: int):
        lat = 53.6
        lon = 10 + counter / 100
        entity.coords = Coords(lat, lon)

    def register_truck(self, entity: Truck):
        body = {"name": entity.name, "lat": entity.coords.lat, "lon": entity.coords.lon}
        response = do_post(self.PATH, body)
        entity.truck_id = response["id"]
        print(f"successfully created truck with id: {entity.truck_id}")
