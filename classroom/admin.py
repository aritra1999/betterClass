from django.contrib import admin

from django.contrib import admin
from .models import Message, Classroom, Connection, Notes

admin.site.register(Message)
admin.site.register(Classroom)
admin.site.register(Connection)
admin.site.register(Notes)

