from django.shortcuts import get_object_or_404
from django.db.models import Prefetch
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from journals.models import Journal
from journals.serializers import JournalSerializer

# Create your views here.
@api_view(['GET', 'POST'])
def journals_list(request):
    """
    List all journals, or create a journal.
    """
    if request.method == 'GET':
        match_requests = Journal.objects.all()
        serializer = JournalSerializer(match_requests, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = JournalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def journals_detail(request, pk):
    """
    Retrieve, update or delete a journal.
    """
    journal = get_object_or_404(Journal, pk=pk)
    
    if request.method == 'GET':
        serializer = JournalSerializer(journal)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = JournalSerializer(journal, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        journal.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['GET'])
def journal_by_user(request, username):
    """
    Get all journals for a specific user given username
    """
    user_journals = Journal.objects.filter(user_skill__user__username=username)
    serializer = JournalSerializer(user_journals, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def journal_by_user_skill(request, user_skill_id):
    """
    Get all journals for a user_skill
    """
    user_skill_journals = Journal.objects.filter(user_skill_id=user_skill_id)
    serializer = JournalSerializer(user_skill_journals, many=True)
    return Response(serializer.data)