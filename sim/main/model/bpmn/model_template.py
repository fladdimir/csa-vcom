from typing import Any, Dict, List

from casymda.blocks import Sink, Source

from main.model.blocks.drive_to_customer import DriveToCustomer
from main.model.blocks.drive_to_depot import DriveToDepot
from main.model.blocks.entities import Customer, Truck
from main.model.blocks.issue_order import IssueOrder
from main.model.blocks.load import Load
from main.model.blocks.order_delivered_gateway import OrderDeliveredGateway
from main.model.blocks.register_customer import RegisterCustomer
from main.model.blocks.register_depot import RegisterDepot
from main.model.blocks.register_truck import RegisterTruck
from main.model.blocks.start_shift import StartShift
from main.model.blocks.start_tour import StartTour
from main.model.blocks.tour_done_gateway import TourDoneGateway
from main.model.blocks.unload import Unload


class Model:
    def __init__(self, env):

        self.env = env
        self.model_components: Any
        self.model_graph_names: Dict[str, List[str]]

        #!resources+components (generated)

        #!model (generated)

        # translate model_graph_names into corresponding objects
        self.model_graph = {
            self.model_components[name]: [
                self.model_components[nameSucc]
                for nameSucc in self.model_graph_names[name]
            ]
            for name in self.model_graph_names
        }

        for component in self.model_graph:
            component.successors = self.model_graph[component]
