from channels import consumer
from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required


from .models import Classroom, Message



@login_required
def classroom_view(request, classroom_slug):
    
    try:
        classroom = Classroom.objects.get(slug=classroom_slug)
    except:
        return HttpResponse("Classroom not found")

    context = {
        'classroom': classroom,
        'messages': Message.objects.filter(classroom=classroom),
        'title': classroom.name
    }
    return render(request, 'classroom/classroom.html', context)

    



@login_required
def disconnect_user(request, classroom):
    Classroom.objects.get(slug=classroom).users.remove(request.user)

    return redirect('/')

