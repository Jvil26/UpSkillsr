from django.shortcuts import get_object_or_404
from django.db.models import Prefetch
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from journals.models import Journal, ResourceLink
from journals.serializers import JournalSerializer, ResourceLinkSerializer
import anthropic
import tiktoken
import json

client = anthropic.Anthropic()
encoding = tiktoken.get_encoding("cl100k_base")
MAX_INPUT_TOKEN_LEN = 2000


# Create your views here.
@api_view(["GET", "POST"])
def journals_list(request):
    """
    List all journals, or create a journal.
    """
    if request.method == "GET":
        journals = Journal.objects.all()
        serializer = JournalSerializer(journals, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = JournalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def journals_detail(request, pk):
    """
    Retrieve, update or delete a journal.
    """
    journal = get_object_or_404(Journal, pk=pk)

    if request.method == "GET":
        serializer = JournalSerializer(journal)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = JournalSerializer(journal, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        journal.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST"])
def resource_links_list(request):
    if request.method == "GET":
        serializer = ResourceLinkSerializer(request.data)
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = ResourceLinkSerializer(request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def resource_links_detail(request, pk):
    resource_link = get_object_or_404(ResourceLink, pk=pk)

    if request.method == "GET":
        serializer = ResourceLinkSerializer(resource_link)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = ResourceLinkSerializer(request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        resource_link.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["PUT"])
def resource_links_batch(request, journalId):
    journal = get_object_or_404(Journal, id=journalId)
    journal_resource_links = journal.resource_links.all()
    resource_links_data = request.data.get("resourceLinks")

    existing_ids = {link.id for link in journal_resource_links}
    incoming_ids = {link.get("id") for link in resource_links_data if link.get("id")}

    # Delete removed resource links
    ResourceLink.objects.filter(id__in=existing_ids - incoming_ids).delete()

    # Update or Create resource links
    for link_data in resource_links_data:
        link_id = link_data.get("id")
        if link_id and link_id in existing_ids:
            ResourceLink.objects.filter(id=link_id).update(**link_data)
        else:
            ResourceLink.objects.create(journal=journal, **link_data)

    serializer = ResourceLinkSerializer(journal.resource_links.all(), many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
def journals_by_user(request, username):
    """
    Get all journals for a specific user given username
    """
    user_journals = Journal.objects.filter(user_skill__user__username=username)
    serializer = JournalSerializer(user_journals, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def journals_by_user_skill(request, user_skill_id):
    """
    Get all journals for a user_skill
    """
    user_skill_journals = Journal.objects.filter(user_skill_id=user_skill_id)
    serializer = JournalSerializer(user_skill_journals, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def generate_journal_summary(request):
    """
    Generate Claude AI summary of journal text_content
    """
    try:
        text_content = request.data.get("textContent")
        tokens_len = token_count(text_content)
        if tokens_len > MAX_INPUT_TOKEN_LEN:
            return Response({"error": "Your prompt is too long. Please shorten your input and try again."}, status=status.HTTP_400_BAD_REQUEST)
        message = client.messages.create(
            model="claude-3-5-haiku-20241022",
            max_tokens=3000,
            temperature=0.7,
            system="You are an intelligent assistant that helps users summarize their personal learning journals.",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": build_llm_summary_prompt(text_content)}
                    ],
                }
            ],
        )

        summary = message.content[0].text
        return Response({"summary": summary}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def generate_journal(request):
    """
    Generate Journal with Claude AI
    """
    try:
        prompts = request.data.get("prompts")
        message = client.messages.create(
            model="claude-3-5-haiku-20241022",
            max_tokens=3000,
            temperature=0.7,
            system="You are a helpful assistant that writes reflective journal entries for skill development. Given the user's answers to some journaling questions, generate a detailed and thoughtful journal entry.",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": build_llm_journal_prompt(prompts)}
                    ],
                }
            ],
        )

        journal_json = json.loads(message.content[0].text)
        if journal_json and all(
            journal_json.get(field) is not None
            for field in ["title", "text_content", "youtube_url", "summary"]
        ):
            return Response(journal_json, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "Bad request"}, status=status.HTTP_400_BAD_REQUEST
            )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def build_llm_journal_prompt(prompts):
    users_responses = []
    for i, prompt in enumerate(prompts):
        users_responses.append(
            f"{(i+1)}. {prompt["question"]}\nAnswer: {prompt["answer"]}"
        )

    return f"""
        Use the answers to write:
        - A concise, descriptive title (limit to 50 characters)
        - A detailed journal entry in natural language that sounds reflective and personal
        - (Optional) If relevant, suggest a YouTube URL that could help reinforce the learning
        - A brief summary capturing the key insights of the journal entry

        Respond with **only** valid JSON (no markdown, no explanation), and make sure all newline characters inside strings are properly escaped with \\n.

        Format the response in JSON with the following fields:
        {{
        "title": string,
        "text_content": string,
        "youtube_url": string (or null if not applicable)
        "summary": string
        }}

        User's responses: {("\n\n").join(users_responses)}
        """


def build_llm_summary_prompt(text_content):
    return f"""
    Journal Entry:
    \"\"\"
    {text_content}
    \"\"\"

    Summarize the journal entry using the following sections — include only the relevant ones:

    1. **Key Learnings** — What important concepts or takeaways did the user understand?
    2. **Misunderstandings & Clarifications** — Only include this if the user had incorrect assumptions or confusion that got resolved.
    3. **Implementation Notes** — Briefly describe how the user approached the task, including techniques or tools used — only if they are important to the learning.

    Do not include any other sections or interpretations. Only return the relevant sections, in this order, with the section titles exactly as written.
    """


def token_count(input):
    if isinstance(input, dict):
        total_tokens = 0
        for question, answer in input.items():
            total_tokens += len(encoding.encode(question))
        return total_tokens
    else:
        total_tokens = 

    tokens = encoding.encode(input)
    return len(tokens)