import os
from typing import Generator, List

import geopy.distance
from casymda.blocks.block_components import VisualizableBlock
from simpy import Interrupt

from .entities import Coords, Truck
from .request import do_get, do_patch

DEFAULT_OSRM_HOST = "http://localhost:5000"
OSRM_HOST = os.environ.get("OSRM_HOST", DEFAULT_OSRM_HOST)


class Segment:
    def __init__(
        self, start: Coords, end: Coords, distance: float, cumulated_distance_end: float
    ) -> None:
        self.start = start
        self.end = end
        self.distance = distance
        self.cumulated_distance_start = cumulated_distance_end - distance
        self.cumulated_distance_end = cumulated_distance_end


class DriveRoute(VisualizableBlock):

    ROUTE_PATH = "/route/v1/driving/"
    PATH = "/trucks/"

    update_timestep = 300
    FPS = 2

    def drive(self, entity: Truck, from_point: Coords, to_point: Coords) -> Generator:
        entity.coords = from_point
        self.update_position(entity)

        duration, segments = self.request_route(from_point, to_point)

        update_loop = self.setup_update_loop(entity, duration, segments)

        yield self.env.timeout(duration)

        update_loop.interrupt()

        entity.coords = to_point
        self.update_position(entity)

    def setup_update_loop(self, entity: Truck, duration, segments):
        return self.env.process(self.update_loop(entity, duration, segments))

    def update_loop(self, entity: Truck, duration, segments: List[Segment]):
        calculated_distance = segments[-1].cumulated_distance_end
        speed = calculated_distance / duration if duration > 0 else 1
        try:
            time_spent = 0
            while True:
                self.adjust_update_timestep()
                yield self.env.timeout(self.update_timestep)
                time_spent += self.update_timestep
                self.calc_progress_and_update(entity, time_spent, speed, segments)
        except Interrupt:
            pass  # arrival

    def calc_progress_and_update(
        self, entity: Truck, time_spent: float, speed: float, segments: List[Segment],
    ):
        distance = time_spent * speed
        segment = next(
            filter(
                lambda s: s.cumulated_distance_start
                <= distance
                <= s.cumulated_distance_end,
                segments,
            )
        )
        progress = (distance - segment.cumulated_distance_start) / segment.distance
        progress = min((progress, 1))
        from_point = segment.start
        to_point = segment.end
        lat = (to_point.lat - from_point.lat) * progress + from_point.lat
        lon = (to_point.lon - from_point.lon) * progress + from_point.lon
        entity.coords = Coords(lat, lon)
        self.update_position(entity)

    def update_position(self, entity: Truck):
        path = self.PATH + str(entity.truck_id) + "/"
        body = {"lat": entity.coords.lat, "lon": entity.coords.lon}
        do_patch(path, body)

    def adjust_update_timestep(self):
        if hasattr(self.env, "factor"):
            self.update_timestep = (1 / self.FPS) / self.env.factor

    def request_route(self, from_point: Coords, to_point: Coords):
        req_path = f"{from_point.lon},{from_point.lat};{to_point.lon},{to_point.lat}?geometries=geojson"
        path = self.ROUTE_PATH + req_path
        response = do_get(path, base_url=OSRM_HOST)
        route = response["routes"][0]
        duration = route["duration"]
        coordinates = route["geometry"]["coordinates"]  # [[lon1,lat1],[lon2,lat2],...]
        return duration, self.coordinates2segments(coordinates)

    def coordinates2segments(self, coordinates):
        segments: List[Segment] = []
        cumulated_distance = 0
        for i in range(len(coordinates) - 1):
            start = coordinates[i]
            end = coordinates[i + 1]
            from_point = Coords(start[1], start[0])
            to_point = Coords(end[1], end[0])
            distance = self.distance_between(from_point, to_point)
            cumulated_distance += distance
            segments.append(Segment(from_point, to_point, distance, cumulated_distance))
        return segments

    def distance_between(self, from_point: Coords, to_point: Coords):
        return geopy.distance.distance(
            (from_point.lat, from_point.lon), (to_point.lat, to_point.lon)
        ).meters
