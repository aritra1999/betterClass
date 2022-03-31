from mailbox import NotEmptyError
from channels import consumer
from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt

from .models import Classroom, Message, Notes
import json


@login_required
def classroom_view(request, classroom_slug):
    try:
        classroom = Classroom.objects.get(slug=classroom_slug)
    except:
        return HttpResponse("Classroom not found")

    try: 
        note = Notes.objects.get(user=request.user, classroom=classroom)
    except:
        note = Notes.objects.create(user=request.user, classroom=classroom)
        
    context = {
        'classroom': classroom,
        'messages': Message.objects.filter(classroom=classroom),
        'note': note,
        'title': classroom.name
    }
    return render(request, 'classroom/classroom.html', context)


@login_required
def disconnect_user(request, classroom):
    Classroom.objects.get(slug=classroom).users.remove(request.user)

    return redirect('/')


@login_required
def delete_classroom(request, classroom):
    try: 
        classroom = Classroom.objects.get(slug=classroom)
        if request.user == classroom.created_by:
            classroom.delete()
        else:
            return HttpResponse("You're not the owner of the class.")    
        return redirect('/')
    except:
        return HttpResponse('500 Internal Server Error.')

@csrf_exempt
def sync_board_view(request, classroom_slug):
    try: 
        classroom = Classroom.objects.get(slug=classroom_slug)
        board = json.loads(classroom.board)
        board[str('page' + request.POST.get('page'))] = request.POST.get('board')

        classroom.board = json.dumps(board)
        classroom.save()

        return JsonResponse({
            "message": "Board synced"
        })
    except: 
        return HttpResponse('404 Classroom not found');
    
@csrf_exempt
def sync_note_view(request, classroom_slug):
    try: 
        note = Notes.objects.get(user=request.user, classroom__slug=classroom_slug)
        note.note = request.POST.get('note')
        note.save()

        return JsonResponse({
            "message": "Notes synced"
        })
    except: 
        return HttpResponse('404 Classroom not found');
    