from django.contrib import admin
from django.urls import path
from django.contrib.auth.views import LogoutView

from home.views import (
    home_view
)

from accounts.views import signin_view, signup_view
from classroom.views import classroom_view

urlpatterns = [
    path('admin/', admin.site.urls),

    path('', home_view, name='home'),

    path('auth/signin', signin_view, name='signin'),
    path('auth/signup', signup_view, name='signup'),
    path('auth/logout/', LogoutView.as_view(), name="logout"),

    path('<classroom_slug>', classroom_view, name='classroom'),
]
