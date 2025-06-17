from django.db import models

# Create your models here.
class Skill(models.Model):
    SKILL_TYPES = [
        ('Offered', 'offered'),
        ('Wanted', 'wanted')
    ]
    PROCIENCY_TYPES = [
        ('pro', 'Pro'),
        ('noob', 'Noob'),
    ]
    name = models.CharField(max_length=100, null=False)
    user = models.ForeignKey('users.user', on_delete=models.CASCADE, related_name='skills')
    skill_type = models.CharField(max_length=10, choices=SKILL_TYPES)
    proficiency = models.CharField(max_length=10, choices=PROCIENCY_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.skill_type}) by {self.user.username}"
