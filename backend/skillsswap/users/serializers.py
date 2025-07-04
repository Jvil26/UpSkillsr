from rest_framework import serializers
from users.models import User, UserProfile, UserSkill
from skills.serializers import SkillSerializer
from skills.models import Skill
from journals.models import Journal
from journals.serializers import JournalSerializer

class UserProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user'
    )

    class Meta:
        model = UserProfile
        fields = [
            'id',
            'user_id',
            'bio',
            'gender',
            'profile_pic',
            'phone'
        ]

class UserSkillSerializer(serializers.ModelSerializer):
    skill = SkillSerializer(read_only=True)
    skill_id = serializers.PrimaryKeyRelatedField(
        queryset=Skill.objects.all(), source='skill', write_only=True
    )
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True
    )
    journals = JournalSerializer(many=True, read_only=True)

    class Meta:
        model = UserSkill
        fields = [
            'id',
            'user',
            'user_id',
            'skill_id',
            'skill',
            'journals',
            'proficiency',
            'created_at',
            'updated_at'
        ]

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    user_skills = UserSkillSerializer(many=True, read_only=True)
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'name',
            'email',
            'profile',
            'user_skills',
            'created_at'
        ]