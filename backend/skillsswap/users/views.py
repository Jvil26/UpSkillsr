from django.shortcuts import get_object_or_404
from django.db import IntegrityError

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticatedOrReadOnly,
    IsAuthenticated,
)
from rest_framework.decorators import permission_classes

from users.models import User, UserProfile, UserSkill
from users.serializers import UserSerializer, UserProfileSerializer, UserSkillSerializer


# Create your views here.
@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def user_list(request):
    """
    List all users, or create a new user.
    """

    if request.method == "GET":
        permission = IsAuthenticated()
        if not permission.has_permission(request, view=None):
            return Response(
                {"detail": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        try:
            username = request.data.get("username")
            if not username:
                return Response(
                    {"error": "Username is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user_defaults = {
                "username": username,
                "name": request.data.get("name"),
                "email": request.data.get("email"),
            }

            user, created = User.objects.get_or_create(
                username=username, defaults=user_defaults
            )

            profile_defaults = {
                "user": user,
                "phone": request.data.get("phone"),
                "gender": (
                    ""
                    if not request.data.get("gender")
                    else request.data.get("gender").lower()
                ),
            }
            UserProfile.objects.get_or_create(user=user, defaults=profile_defaults)

            serializer = UserSerializer(user)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
            )

        except IntegrityError:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticatedOrReadOnly])
def user_detail(request, username):
    """
    Retrieve, update or delete a user.
    """
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(
            {"error": f'User with username "{username}" does not exist'},
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == "GET":
        serializer = UserSerializer(user)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST"])
def user_profile_list(request):
    """
    List all users, or create a new user.
    """
    if request.method == "GET":
        user_profiles = UserProfile.objects.all()
        serializer = UserProfileSerializer(user_profiles, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE", "PATCH"])
def user_profile_detail(request, pk):
    """
    Retrieve, update or delete a user.
    """
    try:
        user_profile = UserProfile.objects.get(pk=pk)
    except UserProfile.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data)

    elif request.method == "PUT" or request.method == "PATCH":
        serializer = UserProfileSerializer(
            user_profile, data=request.data, partial=request.method == "PATCH"
        )
        if serializer.is_valid():
            serializer.save()
            updated_user = UserSerializer(user_profile.user)
            return Response(updated_user.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        user_profile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST"])
def user_skill_list(request):
    """
    List all user skills, or create a user skill.
    """
    if request.method == "GET":
        user_skills = UserSkill.objects.all()
        serializer = UserSkillSerializer(user_skills, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        is_many = isinstance(request.data, list)
        serializer = UserSkillSerializer(data=request.data, many=is_many)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def user_skill_detail(request, pk):
    """
    Retrieve, update or delete a user skill.
    """
    try:
        user_skill = UserSkill.objects.get(pk=pk)
    except UserSkill.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = UserSkillSerializer(user_skill)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = UserSkillSerializer(user_skill, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        user_skill.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
def user_skills_for_user_list(request, username):
    get_object_or_404(User, username=username)
    user_skills = UserSkill.objects.filter(user__username=username)
    serializer = UserSkillSerializer(user_skills, many=True)
    return Response(serializer.data)
