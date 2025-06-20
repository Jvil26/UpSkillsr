from rest_framework import serializers
from matches.models import MatchRequest
from users.serializers import UserSerializer, UserSkillSerializer
from users.models import User, UserSkill

class MatchRequestSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(read_only=True)
    from_user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='from_user', write_only=True
    )
    to_user = UserSerializer(read_only=True)
    to_user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='to_user', write_only=True
    )
    skills_offered_by_from_user = UserSkillSerializer(read_only=True)
    skills_offered_by_from_user_id = serializers.PrimaryKeyRelatedField(
        queryset=UserSkill.objects.all(), source='skills_offered_by_from_user', write_only=True
    )
    skills_offered_by_to_user = UserSkillSerializer(read_only=True)
    skills_offered_by_to_user_id = serializers.PrimaryKeyRelatedField(
        queryset=UserSkill.objects.all(), source='skills_offered_by_to_user', write_only=True
    )
    class Meta:
        model = MatchRequest
        fields = [
            'id',
            'from_user',
            'from_user_id',
            'to_user',
            'to_user_id',
            'skills_offered_by_from_user',
            'skills_offered_by_to_user',
            'status',
            'created_at'
        ]