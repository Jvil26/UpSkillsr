from django.db import models
from .storages import PublicMediaStorage
from skills.models import Skill

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=30, null=False, unique=True)
    first_name = models.CharField(max_length=30, null=False)
    last_name = models.CharField(max_length=30, null=False)
    email = models.EmailField(unique=True, null=False)
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
    
    def save(self, *args, **kwargs):
        try:
            old = UserProfile.objects.get(pk=self.pk)
            if old.profile_pic and old.profile_pic != self.profile_pic:
                old.profile_pic.delete(save=False)
        except UserProfile.DoesNotExist:
            pass
        super().save(*args, **kwargs)

class UserSkill(models.Model):
    SKILL_TYPES = [
        ('Offered', 'offered'),
        ('Wanted', 'wanted')
    ]
    PROCIENCY_TYPES = [
        ('pro', 'Pro'),
        ('noob', 'Noob'),
    ]
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='user_skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name="user_skill_entries")
    skill_type = models.CharField(max_length=10, choices=SKILL_TYPES)
    proficiency = models.CharField(max_length=10, choices=PROCIENCY_TYPES, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.skill.name} ({self.skill_type}) by {self.user.username}"
    
    class Meta:
        unique_together = ('user', 'skill', 'skill_type')
