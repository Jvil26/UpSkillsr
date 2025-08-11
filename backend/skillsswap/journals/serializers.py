from rest_framework import serializers
from journals.models import Journal, ResourceLink
from users.serializers import UserSkillSerializer
from users.models import UserSkill


class ResourceLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceLink
        fields = "__all__"

    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            fields["journal"].queryset = Journal.objects.filter(
                user_skill__user__username=request.user.username
            )
        return fields


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

    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            fields["user_skill_id"].queryset = UserSkill.objects.filter(
                user__username=request.user.username
            )
        return fields
