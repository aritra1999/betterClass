from statistics import mode
from django.db import models
from django.contrib.auth.models import User
from MajorProject.utils import slug_generator

class Classroom(models.Model):
    name = models.CharField(max_length=50, null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="teacher")
    slug = models.SlugField(max_length=11, blank=True, null=True)
    oneway = models.BooleanField(default=True)
    board = models.TextField(blank=True, null=True, default="{}")
    timestamp = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.slug is None:
            self.slug = slug_generator()
        super(Classroom, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.slug)


class Message(models.Model):
    message = models.CharField(max_length=1000, null=True, blank=True)
    sent_by = models.ForeignKey(User, on_delete=models.CASCADE)
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.message)

class Notes(models.Model):
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)
    user = models.CharField(max_length=100, null=True, blank=True)
    note = models.CharField(max_length=1000, null=True, blank=True)

    def __str__(self): 
        return self.user 

class Connection(models.Model):
    # user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user")
    user = models.CharField(max_length=100, null=True, blank=True)
    # classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name="classroom")
    classroom = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.user 


