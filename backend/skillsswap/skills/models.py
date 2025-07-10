from django.db import models


# Create your models here.
class Skill(models.Model):
    name = models.CharField(max_length=100, null=False)
    category = models.CharField(max_length=100, null=False)

    def __str__(self):
        return f"Category: {self.category}, Skill: {self.name}"

    def save(self, *args, **kwargs):
        self.name = self.name.strip().title()
        super().save(*args, **kwargs)

    class Meta:
        unique_together = ("name", "category")
