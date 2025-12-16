
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("like_post", views.like_post, name="like_post"),
    path("update_post", views.update_post, name="update"),
    path("create_post", views.create_post, name="create"),
    path("profile/<str:username>", views.profile, name="profile"),
    path("following", views.follow, name="follow")
]
