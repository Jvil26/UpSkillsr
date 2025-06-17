from django.urls import path
from . import views

urlpatterns = [
    path("get_all_users", views.get_all_users),
]