from .drive_route import DriveRoute
from .entities import Coords, Truck


class DriveToDepot(DriveRoute):
    def actual_processing(self, entity: Truck):
        depot_loc = entity.tour_dict["depot"]["location"]
        lat = depot_loc["lat"]
        lon = depot_loc["lon"]

        from_point = entity.coords
        to_point = Coords(lat, lon)

        yield self.env.process(self.drive(entity, from_point, to_point))
