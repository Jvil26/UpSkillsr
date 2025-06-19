from django.urls import path
from users import views

urlpatterns = [
    path("users/", views.user_list, name="user-list"),
    path("<int:pk>/", views.user_detail, name="user-detail"),
    path("profiles/", views.user_profile_list, name="user-profile-list"),
    path("profiles/<int:pk>", views.user_profile_detail, name="user-profile-detail"),
    path("userskills", views.user_skill_list, name="user-skill-list"),
    path("userskills/<int:id>", views.user_skill_detail, name="user-skill-detail")
]