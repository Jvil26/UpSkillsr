from django.test import TestCase
from skills.models import Skill

# Create your tests here.
class SkillsTestCase(TestCase):
    def setUp(self):
        self.piano_skill = Skill.objects.create(name="Piano")
        self.programming_skill = Skill.objects.create(name="Programming")

    def test_skill_creation(self):
        self.assertEqual(self.piano_skill.name, "Piano")
        self.assertEqual(self.programming_skill.name, "Programming")