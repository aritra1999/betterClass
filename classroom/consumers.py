import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from django.contrib.auth.models import User
from .models import Message, Classroom, Connection

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
    
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        await connect_user(self.scope['user'], self.room_name)
        print(str("Connect user " + self.scope['user'].username))
        
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'new_user',
                'new_user': self.scope['user'].username,
            }
        )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        await disconnect_user(self.scope['user'], self.room_name)
        print(str("Disconnect user " + self.scope['user'].username))
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_disconnet',
                'new_user': self.scope['user'].username
            }
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        username = text_data_json['username']

            
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': username,
            }
        )

    async def new_user(self, event):
        user = event['new_user']
        all_users = await get_all_users_in_room(self.room_name)
        
        await self.send(text_data=json.dumps({
            'meta': "new_user",
            'new_user': user,
            'user_list': all_users
        }))


    async def user_disconnet(self, event):
        user = event['new_user']
        await self.send(text_data=json.dumps({
            'meta': "user_disconnect",
            'new_user': user,
        }))


    async def chat_message(self, event):
        message = event['message']
        username = event['username']

        await record_message(message, username, self.room_name)  

        await self.send(text_data=json.dumps({
            'meta': "new_message",
            'message': message,
            'username': username,
        }))

    
@database_sync_to_async
def get_all_users_in_room(classroom):
    connections = Connection.objects.filter(classroom=classroom)
    users = []
    for connection in connections: 
        users.append(connection.user)

    return users

@database_sync_to_async
def record_message(message, username, classroom):
    Message.objects.create(
        message=message,
        sent_by=User.objects.get(username=username),
        classroom=Classroom.objects.get(slug=classroom)
    )

@database_sync_to_async
def connect_user(user, classroom):
    
    try:
        Connection.objects.get_or_create(user=user, classroom=classroom)
    except: 
        print("Connection not found")

@database_sync_to_async
def disconnect_user(user, classroom):
    try:
        Connection.objects.get(user=user, classroom=classroom).delete()
    except: 
        print("Connection not found")