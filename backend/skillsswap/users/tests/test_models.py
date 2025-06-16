from django.test import TestCase, override_settings
from django.core.files.uploadedfile import SimpleUploadedFile
from ..models import User, UserProfile
# Create your tests here.
from django.conf import settings
import os

USERNAME = 'jusin'
FIRST_NAME = 'Justin'
LAST_NAME = 'Sin'
EMAIL = 'justinsinsin25@gmail.com'
PASSWORD = '1234'
PHONE = '0123456789'
BIO = 'I am a pro piano player.'
TEST_IMAGE_PATH = os.path.join(os.path.dirname(__file__), 'test_image.jpg')

# @override_settings(DEFAULT_FILE_STORAGE='django.core.files.storage.FileSystemStorage')
class UsersTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(username=USERNAME, first_name=FIRST_NAME, last_name=LAST_NAME, email=EMAIL, password=PASSWORD)
        with open(TEST_IMAGE_PATH, 'rb') as f:
            TEST_IMAGE = SimpleUploadedFile('test_image.jpg', f.read(), content_type='image/jpeg')
            self.user_profile = UserProfile.objects.create(user=self.user, bio=BIO, profile_pic=TEST_IMAGE, phone=PHONE)
    
    def test_user_creation(self):
        user = User.objects.get(username=USERNAME)
        self.assertEqual(user.username, USERNAME)
        self.assertEqual(user.first_name, FIRST_NAME)
        self.assertEqual(user.last_name, LAST_NAME)
        self.assertEqual(user.email, EMAIL)
        self.assertEqual(user.password, PASSWORD)
    
    def test_user_profile_creation(self):
        user_profile = UserProfile.objects.get(user=self.user)
        self.assertEqual(user_profile.user, self.user)
        self.assertEqual(user_profile.bio, BIO)
        self.assertTrue(user_profile.profile_pic.name.split('/')[-1].startswith('test_image'))
        self.assertEqual(user_profile.phone, PHONE)
