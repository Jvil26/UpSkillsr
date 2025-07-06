from django.db import models
from users.storages import PublicMediaStorage


# Create your models here.
class Journal(models.Model):
    user_skill = models.ForeignKey(
        "users.UserSkill", on_delete=models.CASCADE, related_name="journals"
    )
    title = models.CharField(max_length=50)
    text_content = models.TextField()
    media = models.FileField(
        upload_to="journal_medias/", storage=PublicMediaStorage(), blank=True, null=True
    )
    youtube_url = models.CharField(max_length=255, blank=True, null=True)
    ai_summary = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Journal entry for {self.user_skill.skill.name} on {self.created_at.strftime('%Y-%m-%d')}"

    class Meta:
        unique_together = ("user_skill", "title")
