from django.contrib import admin

from django.contrib import admin
from .models import Message, Classroom, Connection

admin.site.register(Message)
admin.site.register(Classroom)
admin.site.register(Connection)
