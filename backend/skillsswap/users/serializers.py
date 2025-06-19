from rest_framework import serializers
from users.models import User, UserProfile, UserSkill
from skills.serializers import SkillSerializer
from skills.models import Skill

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
            'created_at'
        ]

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True
    )

    class Meta:
        model = UserProfile
        fields = [
            'id',
            'user',
            'user_id',
            'profile_pic',
            'phone'
        ]

class UserSkillSerializer(serializers.ModelSerializer):
    skill = SkillSerializer(read_only=True)
    skill_id = serializers.PrimaryKeyRelatedField(
        queryset=Skill.objects.all(), source='skill', write_only=True
    )
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True
    )
    class Meta:
        model = UserSkill
        fields = [
            'id',
            'user',
            'user_id',
            'skill',
            'skill_id',
            'skill_type',
            'proficiency',
            'created_at',
            'last_updated'
        ]