from django.db import models
from .storages import PublicMediaStorage
from skills.models import Skill

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=30, null=False, unique=True)
    name = models.CharField(max_length=100, null=False)
    email = models.EmailField(unique=True, null=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Username: {self.username}, Name: {self.name}, email: {self.email}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True)
    profile_pic = models.ImageField(upload_to='profile_pics/', storage=PublicMediaStorage(), blank=True, null=True)
    phone = models.CharField(max_length=30, blank=True)
    gender = models.CharField(max_length=25, blank=True)

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
    PROCIENCY_TYPES = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced')
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name="user_skill_entries")
    proficiency = models.CharField(max_length=12, choices=PROCIENCY_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.skill.name}, {self.proficiency}"
    
    class Meta:
        unique_together = ('user', 'skill')
