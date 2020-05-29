import json
import time

from channels.generic.websocket import WebsocketConsumer
from django.db.models import Sum

from .models import *


class TruckUpdatesWebsocket(WebsocketConsumer):
    possum: float = 0

    def disconnect(self, close_code):
        print("ws disconnected")

    def receive(self, text_data):
        print("ws message received: " + text_data)

    def connect(self):
        self.accept()
        print("ws connected")

        # TODO: use (redis) channel layer to get change notifications at update-events
        while True:
            time.sleep(1)
            if self.update_happened():
                self.send(text_data=json.dumps({}))

    def update_happened(self) -> bool:
        agg = Truck.objects.aggregate(Sum("lat"), Sum("lon"))
        agg_values = list(filter(None, agg.values()))
        new_possum = sum(agg_values) if len(agg_values) > 0 else 0
        changed = new_possum != self.possum
        self.possum = new_possum
        return changed
