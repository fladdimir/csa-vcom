import os
from typing import Dict, List, Optional

from . import osrm
from .router import Point, Router

OSRM_HOST_KEY = "OSRM_HOST"
osrm.RequestConfig.host = os.environ.get(OSRM_HOST_KEY, osrm.RequestConfig.host)
print(f"osrm.RequestConfig.host: {osrm.RequestConfig.host}")
osrm.connection_check()


class OsrmRouter(Router):
    def _snap_point(self, point: Point) -> Optional[float]:

        result = osrm.nearest((point.lon, point.lat))
        if result["code"] != "Ok":
            return None
        waypoint = result["waypoints"][0]
        distance_to_original = waypoint["distance"]

        return distance_to_original

    def get_durations(
        self, from_point: Point, to_points: List[Point]
    ) -> Dict[Point, Dict[Point, float]]:

        results = {from_point: {}}

        sources = [(from_point.lon, from_point.lat)]
        destinations = [(p.lon, p.lat) for p in to_points]
        r1 = osrm.table(sources, destinations)  # forth
        r2 = osrm.table(destinations, sources)  # back
        for idx, p in enumerate(to_points):
            results[from_point][p] = r1[0][0][idx]
            results[p] = {from_point: r2[0][idx][0]}

        return results
