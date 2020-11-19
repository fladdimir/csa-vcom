from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver

from ..routing.location_routing import create_routes, validate_location
from .models import Location


def get_or_create_location_from_coords(lat, lon) -> Location:
    existing_locs = Location.objects.filter(lat=lat, lon=lon)
    if existing_locs:
        loc = existing_locs[0]
    else:
        loc = Location(lat=lat, lon=lon)
        loc.save()
    return loc


@receiver(pre_save, sender=Location)
def location_pre_save(sender, instance: Location, raw, using, update_fields, **kwargs):
    validate_location(instance)


@receiver(post_save, sender=Location)
def location_post_save(sender, instance: Location, raw, using, update_fields, **kwargs):
    create_routes(instance)
