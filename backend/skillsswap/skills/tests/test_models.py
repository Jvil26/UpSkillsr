from django.test import TestCase
from skills.models import Skill

USERNAME = 'jusin'
FIRST_NAME = 'Justin'
LAST_NAME = 'Sin'
EMAIL = 'justinsinsin25@gmail.com'
PHONE = '0123456789'
BIO = 'I am a pro piano player.'


# Create your tests here.
class SkillsTestCase(TestCase):
    def setUp(self):
        self.piano_skill = Skill.objects.create(name="Piano")
        self.programming_skill = Skill.objects.create(name="Programming")

    def test_skill_creation(self):
        self.assertEqual(self.piano_skill.name, "Piano")
        self.assertEqual(self.programming_skill.name, "Programming")