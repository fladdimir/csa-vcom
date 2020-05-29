from casymda.blocks.block_components import VisualizableBlock

from .entities import Truck


class Load(VisualizableBlock):
    def actual_processing(self, entity: Truck):
        weight_sum = sum(map(lambda o: o["weight"], entity.tour_dict["order_set"]))
        duration = weight_sum * (1 / 3)  # sec / unit
        yield self.env.timeout(duration)
