from rest_framework import serializers
from journals.models import Journal, ResourceLink


class ResourceLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceLink
        fields = "__all__"


class JournalSerializer(serializers.ModelSerializer):
    resource_links = ResourceLinkSerializer(many=True, required=False)

    class Meta:
        model = Journal
        fields = "__all__"
