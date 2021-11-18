from django.shortcuts import redirect, render

from classroom.models import Classroom, Connection

def home_view(request):
    context = {
        "title": "Home",
    }

    if request.user.is_authenticated:
        if request.method == "POST":
            classroom = Classroom.objects.create(
                name = request.POST.get('classname'),
                created_by = request.user,
            )

            return redirect('/' + str(classroom.slug))
        classes = Classroom.objects.all()

        context['classrooms'] = classes
    return render(request, 'home/home.html', context)


