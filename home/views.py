from django.shortcuts import redirect, render
from classroom.models import Classroom, Connection, Notes

def home_view(request):
    context = {
        "title": "Home",
    }

    if request.user.is_authenticated:
        if request.method == "POST":
            oneway = True if request.POST.get('oneway') == 'on' else False

            classroom = Classroom.objects.create(
                name = request.POST.get('classname'),
                oneway = oneway,
                created_by = request.user,
            )

            return redirect('/' + str(classroom.slug))
        classes = Classroom.objects.all()
        notes = Notes.objects.filter(user=request.user)
        context['classrooms'] = classes
        context['notes'] = notes
    return render(request, 'home/home.html', context)


