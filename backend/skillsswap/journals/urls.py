from django.urls import path

from journals import views

urlpatterns = [
    path("", views.journals_list, name="journals-list"),
    path("<int:pk>/", views.journals_detail, name="journals_detail"),
    path("user-skill/<int:user_skill_id>/", views.journal_by_user_skill, name="journals-by-user-skill"),
    path("user/<str:username>/", views.journal_by_user, name="journals-by-user")
]