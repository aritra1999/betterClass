from django.contrib import admin
from django.urls import path, include
from django.contrib.auth.views import LogoutView

from home.views import (
    home_view
)

from accounts.views import (
    signin_view, 
    signup_view, 
    profile_view
)

from classroom.views import (
    classroom_view, 
    delete_classroom, 
    sync_board_view, 
    sync_note_view, 
    notes_view
)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('', home_view, name='home'),

    path('<classroom_slug>', classroom_view, name='classroom'),
    path('notes/<classroom_slug>', notes_view, name="notes"),
    
    
    path('profile/', profile_view, name='profile'),
    path('accounts/', include('allauth.urls')),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('auth/signin', signin_view, name='signin'),
    path('auth/signup', signup_view, name='signup'),
    # path('auth/logout/', LogoutView.as_view(), name="logout"),

    path('sync_board/<classroom_slug>', sync_board_view, name='sync_board'),
    path('sync_note/<classroom_slug>', sync_note_view, name='sync_note'),
    path('delete/<classroom>', delete_classroom, name='delete_class')
]
