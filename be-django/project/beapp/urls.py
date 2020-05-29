from django.urls import include, path

from rest_framework import routers


from . import views

router = routers.DefaultRouter()
router.register("locations", views.LocationViewSet)
router.register("depots", views.DepotViewSet)
router.register("customers", views.CustomerViewSet)
router.register("orders", views.OrderViewSet)
router.register("tours", views.TourViewSet)
router.register("trucks", views.TruckViewSet)
router.register("tour-locations", views.TourLocations)
router.register(
    "recalculate-pending-tours", views.TourCalculator, basename="tour-calculator"
)
router.register(
    "match-tours-and-trucks", views.TruckTourMatcher, basename="tour-matcher"
)

urlpatterns = [
    path("", views.index, name="index"),
    path("", include(router.urls)),
]
