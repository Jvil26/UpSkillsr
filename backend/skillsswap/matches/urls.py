from django.urls import path

from matches import views

urlpatterns = [
    path("", views.match_request_list, name="match-request-list"),
    path("<int:pk>/", views.match_request_detail, name="match-request-detail")
]