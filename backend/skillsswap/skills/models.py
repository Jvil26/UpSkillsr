from django.db import models

# Create your models here.
class Skill(models.Model):
    name = models.CharField(max_length=100, null=False, unique=True)

    def __str__(self):
        return f"Skill: {self.name}"

    def save(self, *args, **kwargs):
        self.name = self.name.strip().title()
        super().save(*args, **kwargs)