# create depot
from casymda.blocks.block_components import VisualizableBlock

from .request import do_post


class RegisterDepot(VisualizableBlock):

    PATH = "/depots/"

    def __init__(
        self, env, name, block_capacity=float("inf"), xy=(0, 0), ways={},
    ):
        super().__init__(env, name, block_capacity=block_capacity, xy=xy, ways=ways)

    def actual_processing(self, entity):
        lat = 53.6
        lon = 9.9 + 0.1 * self.overall_count_in
        self.register_depot(self.overall_count_in, lat, lon)
        yield self.env.timeout(0)

    def register_depot(self, num: int, lat: float, lon: float):
        body = {"name": f"depot_{num}", "location": {"lat": lat, "lon": lon}}
        response = do_post(self.PATH, body)
        depot_id = response["id"]
        print(f"successfully created depot with id: {depot_id}")
