from casymda.blocks.block_components import VisualizableBlock

from .entities import Customer
from .request import do_post


class IssueOrder(VisualizableBlock):

    PATH = "/orders/"

    def __init__(
        self, env, name, block_capacity=float("inf"), xy=(0, 0), ways={},
    ):
        super().__init__(env, name, block_capacity=block_capacity, xy=xy, ways=ways)
        self.customer_counter = 0

    def actual_processing(self, entity: Customer):
        self.customer_counter += 1

        for i in range(1, 3):
            weight = self.customer_counter * i * 25
            self.issue_order(entity, weight)

        yield self.env.timeout(0)

    def issue_order(self, entity: Customer, weight: int):
        body = {"customer": entity.customer_id, "weight": weight}
        response = do_post(self.PATH, body)
        order_id = response["id"]
        print(f"successfully created order with id: {order_id} and weight: {weight}")
