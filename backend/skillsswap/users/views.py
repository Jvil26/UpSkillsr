from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponse
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import User
from .models import UserProfile
# Create your views here.
USERNAME = 'jusin'
FIRST_NAME = 'Justin'
LAST_NAME = 'Sin'
EMAIL = 'justinsinsin25@gmail.com'
PASSWORD = '1234'
PHONE = '0123456789'
BIO = 'I am a pro piano player.'
TEST_IMAGE = SimpleUploadedFile('./tests/test_image.jpg', b'Fake image', content_type='image/jpeg')

def get_all_users(request):
    users = User.objects.all()
    print(users)
    users_dict = {user.id: str(user) for user in users}
    return HttpResponse(f"Users: {users_dict}")