from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from skills.models import Skill
from skills.serializers import SkillSerializer

# Create your views here.


@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def skill_list(request):
    """
    List all skills, or create a new skill.
    """
    if request.method == "GET":
        skills = Skill.objects.all()
        serializer = SkillSerializer(skills, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = SkillSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def skill_detail(request, pk):
    """
    Retrieve, update or delete a skill.
    """
    try:
        skill = Skill.objects.get(pk=pk)
    except Skill.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = SkillSerializer(skill)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = SkillSerializer(skill, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        skill.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
