from django.urls import re_path
from django.conf.urls import url

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer.as_asgi()),
    re_path(r'ws/drawshare/(?P<room_name>\w+)/$', consumers.DrawConsumer.as_asgi()),
]



