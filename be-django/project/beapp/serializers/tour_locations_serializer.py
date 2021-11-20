from rest_framework import serializers

from .. import models
from .model_serializers import CustomerSerializer, DepotSerializer, TruckSerializer


class CustomerSerializerWithoutOrders(CustomerSerializer):
    class Meta:
        model = models.Customer
        fields = ["id", "name", "location"]


class OrderSerializerWithCustomerLocations(serializers.ModelSerializer):
    customer = CustomerSerializerWithoutOrders()

    class Meta:
        model = models.Order
        fields = [
            "id",
            "creation_date",
            "customer",
            "weight",
            "rank",
            "is_delivered",
        ]


class TourLocationsSerializer(serializers.Serializer):
    # serializes a tour with all locations

    id = serializers.IntegerField(read_only=True)
    depot = DepotSerializer(read_only=True)
    truck = TruckSerializer(read_only=True)

    order_set = OrderSerializerWithCustomerLocations(many=True, read_only=True)

    class Meta:
        model = models.Tour
        fields = ["id", "depot", "truck", "order_set"]
