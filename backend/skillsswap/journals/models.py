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
    prompts = models.JSONField(default=list)
    summary = models.TextField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Journal entry for {self.user_skill.skill.name} on {self.created_at.strftime('%Y-%m-%d')}"

    class Meta:
        unique_together = ("user_skill", "title")


class ResourceLink(models.Model):
    journal = models.ForeignKey(
        Journal, on_delete=models.CASCADE, related_name="resource_links"
    )
    title = models.CharField(max_length=100)
    url = models.URLField()
    type = models.CharField(
        max_length=50,
        choices=[("Article", "Article"), ("Video", "Video"), ("Book", "Book")],
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return (
            f"Resource Link: Type - {self.type}, Title - {self.title}, URL - {self.url}"
        )
