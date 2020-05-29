from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path("ws/truck-updates/", consumers.TruckUpdatesWebsocket),
]
