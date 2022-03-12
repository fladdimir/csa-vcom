from django.db import models


class Location(models.Model):
    lat = models.FloatField()
    lon = models.FloatField()
    # routes are created on save via signal
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["lat", "lon"], name="location_lat_lon_uc")
        ]

    def save(self, *args, **kwargs):
        # do not allow updates
        if self.pk is None:
            super(Location, self).save(*args, **kwargs)


class Route(models.Model):
    # distance matrix data for locations
    from_loc = models.ForeignKey(
        Location, on_delete=models.CASCADE, related_name="start_routes"
    )
    to_loc = models.ForeignKey(
        Location, on_delete=models.CASCADE, related_name="end_routes"
    )
    duration_sec = models.FloatField()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["from_loc", "to_loc"], name="route_rom_loc_to_loc_uc"
            )
        ]


class Depot(models.Model):
    name = models.CharField(max_length=200, blank=True)
    location = models.ForeignKey(
        Location, on_delete=models.PROTECT, null=True, blank=True
    )


class Customer(models.Model):
    name = models.CharField(max_length=200, blank=True)
    location = models.ForeignKey(
        Location, on_delete=models.PROTECT, null=True, blank=True
    )


class Tour(models.Model):
    # start/end
    depot = models.ForeignKey(Depot, on_delete=models.PROTECT, null=True, blank=True)


class Truck(models.Model):
    name = models.CharField(max_length=200, blank=True)
    capacity = models.IntegerField(default=1000, blank=True)
    # last known position:
    lat = models.FloatField(null=True, blank=True)
    lon = models.FloatField(null=True, blank=True)
    # currently active tour:
    tour = models.OneToOneField(Tour, on_delete=models.PROTECT, null=True, blank=True)


class Order(models.Model):
    creation_date = models.DateTimeField(auto_now_add=True)
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT)
    weight = models.IntegerField(default=1)

    tour = models.ForeignKey(Tour, on_delete=models.SET_NULL, null=True, blank=True)
    # order in which deliveries are carried out within one tour:
    rank = models.PositiveIntegerField(null=True, blank=True)

    is_delivered = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["tour", "rank"], name="order_tour_rank_uc")
        ]
        # possible additional constraints: no delivery without tour, no tour without rank
