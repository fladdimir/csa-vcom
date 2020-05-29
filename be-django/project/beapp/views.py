import json

from django.http import HttpResponse
from rest_framework import viewsets

from .models import *
from .serializers import *

from .tour_planning import calculate_tours_for_pending_orders, match_trucks_and_tours


def index(request):
    return HttpResponse("Hello, world! You're at the index.")


class TourCalculator(viewsets.GenericViewSet, viewsets.mixins.CreateModelMixin):
    http_method_names = ["post"]

    def create(self, request):
        info_dict = calculate_tours_for_pending_orders()
        return HttpResponse(json.dumps(info_dict))


class TruckTourMatcher(viewsets.GenericViewSet, viewsets.mixins.CreateModelMixin):
    http_method_names = ["post"]

    def create(self, request):
        info_dict = match_trucks_and_tours()
        return HttpResponse(json.dumps(info_dict))


class LocationViewSet(
    viewsets.GenericViewSet,
    viewsets.mixins.CreateModelMixin,
    viewsets.mixins.DestroyModelMixin,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.mixins.ListModelMixin,
):
    """
    API endpoint that allows locations to be viewed, created, or deleted.
    """

    queryset = Location.objects.all()
    serializer_class = LocationSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows customers to be viewed or edited.
    """

    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class DepotViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows depots to be viewed or edited.
    """

    queryset = Depot.objects.all()
    serializer_class = DepotSerializer


class OrderViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows orders to be viewed or edited.
    """

    queryset = Order.objects.all()
    serializer_class = OrderSerializer


class TruckViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows trucks to be viewed or edited.
    """

    queryset = Truck.objects.all()
    serializer_class = TruckSerializer


class TourViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows tours to be viewed or edited.
    """

    queryset = Tour.objects.all()
    serializer_class = TourSerializer


class TourLocations(
    viewsets.GenericViewSet,
    viewsets.mixins.ListModelMixin,
    viewsets.mixins.RetrieveModelMixin,
):
    queryset = Tour.objects.all()  # filter pending tours only
    serializer_class = TourLocationsSerializer
