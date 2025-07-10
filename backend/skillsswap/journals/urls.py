from django.urls import path

from journals import views

urlpatterns = [
    path("", views.journals_list, name="journals-list"),
    path(
        "<int:journalId>/resource-links/batch/",
        views.resource_links_batch,
        name="resource-links-batch",
    ),
    path("<int:pk>/", views.journals_detail, name="journals_detail"),
    path(
        "user-skill/<int:user_skill_id>/",
        views.journals_by_user_skill,
        name="journals-by-user-skill",
    ),
    path("user/<str:username>/", views.journals_by_user, name="journals-by-user"),
    path("generate-journal/", views.generate_journal, name="generate-journal"),
    path(
        "generate-summary/",
        views.generate_journal_summary,
        name="generate-journal-summary",
    ),
    path("resource-links/", views.resource_links_list, name="resource-links-list"),
    path(
        "resource-links/<int:pk>",
        views.resource_links_detail,
        name="resource-links-detail",
    ),
]
