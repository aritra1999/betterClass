from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.shortcuts import render, redirect

def signin_view(request):
    if request.user.is_authenticated:
        return redirect('/dashboard/')
    context = {
        'title': 'Sign In'
    }
    if request.method == "POST":
        username = request.POST.get('email')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect("/")
        else:
            context['error'] = "Invalid credentials!"
    return render(request, 'accounts/signin.html', context)


def signup_view(request):
    if request.user.is_authenticated:
        return redirect('/dashboard/')
    context = {
        'title': 'SignUp',
    }
    if request.method == "POST":
        password1 = request.POST.get('password')
        password2 = request.POST.get('cnfrm_password')

        if password1 == password2:
            if User.objects.filter(email=request.POST.get('email')).count() == 0:
                user = User.objects.create_user(
                    first_name=request.POST.get('f_name'),
                    last_name=request.POST.get('l_name'),
                    username=request.POST.get('email'),
                    email=request.POST.get('email'),
                    password=password1
                )
                
                user = authenticate(request, username=request.POST.get('email'), password=password1)
                if user is not None:
                    login(request, user)
                    return redirect("/")
            else:
                context['error'] = "Account with same email already exists!"
        else:
            context['error'] = "Passwords don't match!"
    return render(request, 'accounts/signup.html', context)
