from django.test import TestCase, override_settings
from django.conf import settings
from django.db.models import Prefetch
from django.core.files.uploadedfile import SimpleUploadedFile
from journals.models import Journal
from users.models import User, UserSkill
from skills.models import Skill
import os

# Create your tests here.

USERNAME = 'jusin'
NAME = 'Justin Sin'
EMAIL = 'justinsinsin25@gmail.com'
PHONE = '0123456789'
BIO = 'I am a pro piano player.'
GENDER = 'male'
PROFICIENCY = 'Beginner'
TEST_IMAGE_PATH = os.path.join(os.path.dirname(__file__), 'test_image.jpg')
TITLE = "Piano Day 1"
TEXT_CONTENT = "The piano is a versatile musical instrument played by pressing keys that cause hammers to strike strings, producing sound. It is widely used across many genres, including classical, jazz, and pop music. Learning piano helps develop musicality, coordination, and a strong foundation in music theory."

@override_settings(DEFAULT_FILE_STORAGE='django.core.files.storage.FileSystemStorage')
class JournalsTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(username=USERNAME, name=NAME, email=EMAIL)
        self.piano_skill = Skill.objects.create(name="Piano")
        self.piano_user_skill = UserSkill.objects.create(skill=self.piano_skill, user=self.user, proficiency=PROFICIENCY)
        with open(TEST_IMAGE_PATH, 'rb') as f:
            TEST_IMAGE = SimpleUploadedFile('test_image.jpg', f.read(), content_type='image/jpeg')
            self.journal = Journal.objects.create(user_skill=self.piano_user_skill, title=TITLE, text_content=TEXT_CONTENT, media=TEST_IMAGE)
    
    def test_journal_creation(self):
        self.assertEqual(self.journal.user_skill, self.piano_user_skill)
        self.assertEqual(self.journal.title, TITLE)
        self.assertEqual(self.journal.text_content, TEXT_CONTENT)
        self.assertTrue(self.journal.media.name.split('/')[-1].startswith('test_image'))

        