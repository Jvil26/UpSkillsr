from rest_framework import serializers
from journals.models import Journal, ResourceLink
from users.serializers import UserSkillSerializer
from users.models import UserSkill


class ResourceLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceLink
        fields = "__all__"


class JournalSerializer(serializers.ModelSerializer):
    resource_links = ResourceLinkSerializer(many=True, read_only=True)
    user_skill = UserSkillSerializer(read_only=True)
    user_skill_id = serializers.PrimaryKeyRelatedField(
        queryset=UserSkill.objects.all(), source="user_skill", write_only=True
    )

    class Meta:
        model = Journal
        fields = [
            "id",
            "user_skill",
            "user_skill_id",
            "title",
            "text_content",
            "media",
            "prompts",
            "summary",
            "resource_links",
            "updated_at",
            "created_at",
        ]
