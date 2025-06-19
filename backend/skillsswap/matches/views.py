from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from matches.models import MatchRequest
from matches.serializers import MatchRequestSerializer

# Create your views here.
@api_view(['GET', 'POST'])
def match_request_list(request):
    """
    List all match requests, or create a new match request.
    """
    if request.method == 'GET':
        match_requests = MatchRequest.objects.all()
        serializer = MatchRequestSerializer(match_requests, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = MatchRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def match_request_detail(request, pk):
    """
    Retrieve, update or delete a match request.
    """
    try:
        match_request = MatchRequest.objects.get(pk=pk)
    except MatchRequest.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = MatchRequestSerializer(match_request)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = MatchRequestSerializer(match_request, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        match_request.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)