from django.urls import path
from users import views

urlpatterns = [
    path("", views.user_list, name="user-list"),
    path("profiles/", views.user_profile_list, name="user-profile-list"),
    path("profiles/<int:pk>/", views.user_profile_detail, name="user-profile-detail"),
    path("skills/", views.user_skill_list, name="user-skill-list"),
    path("skills/<int:pk>/", views.user_skill_detail, name="user-skill-detail"),
    path("<str:username>/", views.user_detail, name="user-detail"),
    path("<str:username>/skills/", views.user_skills_for_user_list, name="user-skills-for-user-list"),
]