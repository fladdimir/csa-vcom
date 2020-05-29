from channels.routing import ProtocolTypeRouter, URLRouter
import beapp.ws_routing

application = ProtocolTypeRouter(
    {
        # (http->django views is added by default)
        "websocket": URLRouter(beapp.ws_routing.websocket_urlpatterns),
    }
)
