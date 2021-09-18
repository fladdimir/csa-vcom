from rest_framework.exceptions import ValidationError

from ..models import Location, Route
from .osrm_router import OsrmRouter
from .router import Point, Router

# uses router to create & save route model objects

router: Router = OsrmRouter()


def validate_location(location: Location):

    original_point = Point(lat=location.lat, lon=location.lon)
    if not router.is_valid_point(original_point):
        raise ValidationError(
            f"Invalid location - lat: {original_point.lat}, lon: {original_point.lon}"
        )


def create_routes(location: Location):

    existing_locations = list(Location.objects.exclude(id=location.id))

    if len(existing_locations) == 0:
        return

    location_point = Point(lat=location.lat, lon=location.lon)

    # calculate routes
    ex_points_lookup = {}
    for exsl in existing_locations:
        point = Point(lat=exsl.lat, lon=exsl.lon)
        ex_points_lookup[exsl] = point

    existing_points = list(ex_points_lookup.values())
    routes_durations = router.get_durations(
        from_point=location_point, to_points=existing_points
    )

    # save routes (back & forth)
    for exs_loc in existing_locations:
        existing_point = ex_points_lookup[exs_loc]

        route = Route()
        route.to_loc = exs_loc
        route.from_loc = location
        route.duration_sec = routes_durations[location_point][existing_point]
        route.save()

        route_back = Route()
        route_back.to_loc = location
        route_back.from_loc = exs_loc
        route_back.duration_sec = routes_durations[existing_point][location_point]
        route_back.save()
