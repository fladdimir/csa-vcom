from casymda.blocks.block_components import VisualizableBlock

from main.model.blocks.entities import Customer

from .request import do_post


class RegisterCustomer(VisualizableBlock):

    PATH = "/customers/"

    def __init__(
        self, env, name, block_capacity=float("inf"), xy=(0, 0), ways={},
    ):
        super().__init__(env, name, block_capacity=block_capacity, xy=xy, ways=ways)
        self.customer_counter = 0

    def actual_processing(self, entity: Customer):
        self.customer_counter += 1

        lat, lon = self.geo_coords(self.customer_counter)

        self.register_customer(entity, lat, lon)

        yield self.env.timeout(0)

    def geo_coords(self, counter: int):
        lat = 53.58
        lon = 10 + counter / 150
        return lat, lon

    def register_customer(self, entity: Customer, lat, lon):
        body = {"name": entity.name, "location": {"lat": lat, "lon": lon}}
        response = do_post(self.PATH, body)
        customer_id = response["id"]
        entity.customer_id = customer_id
        print(f"successfully created customer with id: {customer_id}")
