from django.urls import path

from skills import views

urlpatterns = [
    path("", views.skill_list, name="skill-list"),
    path("<int:id>/", views.skill_detail, name="skill-detail"),
]