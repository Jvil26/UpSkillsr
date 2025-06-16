from django.db import models
from .storages import PublicMediaStorage

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=30, null=False)
    first_name = models.CharField(max_length=30, null=False)
    last_name = models.CharField(max_length=30, null=False)
    email = models.EmailField(unique=True, null=False)
    password = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Username: {self.username}, First name: {self.first_name}, Last name: {self.last_name}, email: {self.email}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True)
    profile_pic = models.ImageField(upload_to='profile_pics/', storage=PublicMediaStorage(), blank=True, null=True)
    phone = models.CharField(max_length=30, blank=True) 

    def __str__(self):
        return f"{User.username}'s profile, bio - {self.bio}, phone - {self.phone}"
