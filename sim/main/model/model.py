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

        self.customer_source = Source(
            self.env,
            "customer_source",
            xy=(55, 59),
            entity_type=Customer,
            max_entities=10,
            ways={"register_customer": [(73, 59), (171, 59)]},
        )

        self.truck_source = Source(
            self.env,
            "truck_source",
            xy=(55, 210),
            entity_type=Truck,
            max_entities=2,
            ways={"register_truck": [(73, 210), (171, 210)]},
        )

        self.depot_source = Source(
            self.env,
            "depot_source",
            xy=(821, 59),
            max_entities=2,
            ways={"register_depot": [(839, 59), (901, 59)]},
        )

        self.customer_sink = Sink(self.env, "customer_sink", xy=(591, 59), ways={})

        self.truck_sink = Sink(self.env, "truck_sink", xy=(1101, 390), ways={})

        self.depot_sink = Sink(self.env, "depot_sink", xy=(1081, 59), ways={})

        self.register_customer = RegisterCustomer(
            self.env,
            "register_customer",
            xy=(221, 59),
            ways={"issue_order": [(271, 59), (371, 59)]},
        )

        self.issue_order = IssueOrder(
            self.env,
            "issue_order",
            xy=(421, 59),
            ways={"customer_sink": [(471, 59), (573, 59)]},
        )

        self.register_truck = RegisterTruck(
            self.env,
            "register_truck",
            xy=(221, 210),
            ways={"sunrise": [(271, 210), (371, 210)]},
        )

        self.sunrise = StartShift(
            self.env,
            "sunrise",
            xy=(421, 210),
            at=8,
            ways={
                "start_new_tour": [
                    (471, 210),
                    (531, 210),
                    (531, 320),
                    (61, 320),
                    (61, 350),
                ]
            },
        )

        self.start_new_tour = StartTour(
            self.env,
            "start_new_tour",
            xy=(61, 390),
            ways={"drive_to_depot": [(111, 390), (151, 390)]},
        )

        self.drive_to_depot = DriveToDepot(
            self.env,
            "drive_to_depot",
            xy=(201, 390),
            ways={"load_truck": [(251, 390), (301, 390)]},
        )

        self.load_truck = Load(
            self.env,
            "load_truck",
            xy=(351, 390),
            ways={"drive_to_customer": [(401, 390), (451, 390)]},
        )

        self.drive_to_customer = DriveToCustomer(
            self.env,
            "drive_to_customer",
            xy=(501, 390),
            ways={"deliver_order": [(551, 390), (621, 390)]},
        )

        self.deliver_order = Unload(
            self.env,
            "deliver_order",
            xy=(671, 390),
            ways={"tour_finished": [(721, 390), (806, 390)]},
        )

        self.register_depot = RegisterDepot(
            self.env,
            "register_depot",
            xy=(951, 59),
            ways={"depot_sink": [(1001, 59), (1063, 59)]},
        )

        self.tours_left = TourDoneGateway(
            self.env,
            "tours_left",
            xy=(971, 390),
            ways={
                "truck_sink": [(996, 390), (1083, 390)],
                "start_new_tour": [(971, 415), (971, 480), (61, 480), (61, 430)],
            },
        )

        self.tour_finished = OrderDeliveredGateway(
            self.env,
            "tour_finished",
            xy=(831, 390),
            ways={
                "tours_left": [(856, 390), (946, 390)],
                "drive_to_customer": [(831, 415), (831, 460), (501, 460), (501, 430)],
            },
        )

        #!model (generated)

        self.model_components = {
            "customer_source": self.customer_source,
            "truck_source": self.truck_source,
            "depot_source": self.depot_source,
            "customer_sink": self.customer_sink,
            "truck_sink": self.truck_sink,
            "depot_sink": self.depot_sink,
            "register_customer": self.register_customer,
            "issue_order": self.issue_order,
            "register_truck": self.register_truck,
            "sunrise": self.sunrise,
            "start_new_tour": self.start_new_tour,
            "drive_to_depot": self.drive_to_depot,
            "load_truck": self.load_truck,
            "drive_to_customer": self.drive_to_customer,
            "deliver_order": self.deliver_order,
            "register_depot": self.register_depot,
            "tours_left": self.tours_left,
            "tour_finished": self.tour_finished,
        }

        self.model_graph_names = {
            "customer_source": ["register_customer"],
            "truck_source": ["register_truck"],
            "depot_source": ["register_depot"],
            "customer_sink": [],
            "truck_sink": [],
            "depot_sink": [],
            "register_customer": ["issue_order"],
            "issue_order": ["customer_sink"],
            "register_truck": ["sunrise"],
            "sunrise": ["start_new_tour"],
            "start_new_tour": ["drive_to_depot"],
            "drive_to_depot": ["load_truck"],
            "load_truck": ["drive_to_customer"],
            "drive_to_customer": ["deliver_order"],
            "deliver_order": ["tour_finished"],
            "register_depot": ["depot_sink"],
            "tours_left": ["truck_sink", "start_new_tour"],
            "tour_finished": ["tours_left", "drive_to_customer"],
        }
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
