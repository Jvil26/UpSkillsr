from django.test import TestCase
from users.models import User
from skills.models import Skill

USERNAME = 'jusin'
FIRST_NAME = 'Justin'
LAST_NAME = 'Sin'
EMAIL = 'justinsinsin25@gmail.com'
PASSWORD = '1234'
PHONE = '0123456789'
BIO = 'I am a pro piano player.'

# Create your tests here.
class SkillsTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(username=USERNAME, first_name=FIRST_NAME, last_name=LAST_NAME, email=EMAIL, password=PASSWORD)
        self.piano_skill = Skill.objects.create(name='piano', user=self.user, skill_type='offered', proficiency='pro')
        self.programming_skill = Skill.objects.create(name='programming', user=self.user, skill_type='wanted', proficiency='noob')
    
    def test_skill_creation(self):
        self.assertEqual(self.piano_skill.user, self.user)
        self.assertEqual(self.piano_skill.name, 'piano')
        self.assertEqual(self.piano_skill.skill_type, 'offered')
        self.assertEqual(self.piano_skill.proficiency, 'pro')

        self.assertEqual(self.programming_skill.user, self.user)
        self.assertEqual(self.programming_skill.name, 'programming')
        self.assertEqual(self.programming_skill.skill_type, 'wanted')
        self.assertEqual(self.programming_skill.proficiency, 'noob')
    
    def test_user_has_skill(self):
        users = User.objects.prefetch_related('skills')
        self.assertEqual(len(users), 1)
        expected_skill_names = ['piano', 'programming']
        skill_names = [skill.name for skill in users[0].skills.all()]
        self.assertEqual(skill_names, expected_skill_names)