from django.test import TestCase
from .models import MatchRequest
from users.models import User, UserSkill
from skills.models import Skill

# Create your tests here.
USERNAME1 = 'jusin'
NAME1= 'Justin Sin'
EMAIL1 = 'justinsinsin25@gmail.com'
PHONE1 = '0123456789'
BIO1 = 'I am a pro piano player.'

USERNAME2 = 'RySmith'
NAME2 = 'Ryan Smith'
EMAIL2 = 'RySmith@gmail.com'
PHONE2 = '9876543210'
BIO2 = 'I am a pro piano player.'

class MatchRequestsTests(TestCase):
    def setUp(self):
        self.piano_skill = Skill.objects.create(name="Piano")
        self.programming_skill = Skill.objects.create(name="Programming")

        self.from_user = User.objects.create(username=USERNAME1,  name=NAME1, email=EMAIL1)
        self.to_user = User.objects.create(username=USERNAME2, name=NAME2, email=EMAIL2)

        self.piano_user_skill = UserSkill.objects.create(skill=self.piano_skill, user=self.from_user, skill_type='offered', proficiency='pro')
        self.programming_user_skill = UserSkill.objects.create(skill=self.programming_skill, user=self.to_user, skill_type='wanted', proficiency='noob')
        
        self.match_request = MatchRequest(from_user=self.from_user, to_user=self.to_user, skills_offered_by_from_user=self.piano_user_skill, skills_offered_by_to_user=self.programming_user_skill)

    def test_match_request_creation(self):
        self.assertEqual(self.match_request.from_user, self.from_user)
        self.assertEqual(self.match_request.to_user, self.to_user)
        self.assertEqual(self.match_request.skills_offered_by_from_user, self.piano_user_skill)
        self.assertEqual(self.match_request.skills_offered_by_to_user, self.programming_user_skill)

        