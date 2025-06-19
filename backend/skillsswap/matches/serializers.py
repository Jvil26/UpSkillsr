from rest_framework import serializers
from matches.models import MatchRequest
from users.serializers import UserSerializer, UserSkillSerializer

class MatchRequestSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(read_only=True)
    to_user = UserSerializer(read_only=True)
    skills_offered_by_from_user = UserSkillSerializer(read_only=True)
    skills_offered_by_to_user = UserSkillSerializer(read_only=True)

    class Meta:
        model = MatchRequest
        fields = [
            'id',
            'from_user',
            'to_user',
            'skills_offered_by_from_user',
            'skills_offered_by_to_user',
            'status',
            'created_at'
        ]