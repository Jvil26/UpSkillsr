from rest_framework import serializers
from users.models import User, UserProfile, UserSkill
from skills.serializers import SkillSerializer

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

    class Meta:
        model = UserProfile
        fields = [
            'id',
            'user',
            'profile_pic',
            'phone'
        ]


class UserSkillSerializer(serializers.ModelSerializer):
    skill = SkillSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserSkill
        fields = [
            'id',
            'user',
            'skill',
            'skill_type',
            'proficiency',
            'created_at',
            'last_updated'
        ]