from django.urls import path

from journals import views

urlpatterns = [
    path("", views.journals_list, name="journals-list"),
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
]
