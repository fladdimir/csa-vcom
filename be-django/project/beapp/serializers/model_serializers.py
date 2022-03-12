from rest_framework import serializers

from .. import models


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Location
        fields = ["lat", "lon", "id"]

    @classmethod
    def find_or_create_location(cls, validated_data):
        lat = validated_data["location"]["lat"]
        lon = validated_data["location"]["lon"]

        validated_data["location"] = models.get_or_create_location_from_coords(
            lat=lat, lon=lon
        )


class LocationClientSerializer(serializers.ModelSerializer):
    location = LocationSerializer()

    def create(self, validated_data):
        LocationSerializer.find_or_create_location(validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        old_location = instance.location
        instance.location = None
        instance.save()
        old_location.delete()
        LocationSerializer.find_or_create_location(validated_data)
        return super().update(instance, validated_data)


class DepotSerializer(LocationClientSerializer):
    tour_set = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = models.Depot
        fields = ["id", "name", "location", "tour_set"]


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Order
        fields = [
            "id",
            "creation_date",
            "customer",
            "weight",
            "tour",
            "rank",
            "is_delivered",
        ]


class CustomerSerializer(LocationClientSerializer):
    order_set = OrderSerializer(many=True, read_only=True)

    class Meta:
        model = models.Customer
        fields = ["id", "name", "location", "order_set"]


class TourSerializer(serializers.ModelSerializer):
    truck = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = models.Tour
        fields = ["id", "depot", "truck", "order_set"]


class TruckSerializer(serializers.ModelSerializer):
    capacity = serializers.IntegerField(read_only=True)

    class Meta:
        model = models.Truck
        fields = ["id", "name", "capacity", "tour", "lat", "lon"]
