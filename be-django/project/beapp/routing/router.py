from typing import Dict, List, Optional

MAX_SNAPPED_DISTANCE: float = 100  # m


class Point:
    def __init__(self, lat: float, lon: float) -> None:
        self.lat = lat
        self.lon = lon


class Router:
    """ validates locations and calculates shortest paths """

    def is_valid_point(self, point: Point) -> bool:
        """ checks whether point snaps within threshold """
        distance = self._snap_point(point)
        return distance is None or distance <= MAX_SNAPPED_DISTANCE

    def _snap_point(self, point: Point) -> Optional[float]:
        raise NotImplementedError()

    def get_durations(
        self, from_point: Point, to_points: List[Point]
    ) -> Dict[Point, Dict[Point, float]]:
        """ returns dict containing all routes durations from_point to_points, and reverse """
        raise NotImplementedError()
