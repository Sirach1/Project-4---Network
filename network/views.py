from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
import json
from django.db.models import Prefetch

from .models import User, Post, Comment, Like, Follow


def index(request):
    liked_posts = Like.objects.filter(user=request.user)
    # Setting instructions for prefetch
    posts = Post.objects.prefetch_related(
        Prefetch("likes", queryset=liked_posts, to_attr="is_liked")
    )[::-1]
    if request.method == "POST":
        content = request.POST["content"]
        if not content:
            return render(
                request,
                "network/index.html",
                {"posts": posts, "error": "Please type something."},
            )
        post = Post(user=request.user, content=content)
        post.save()
        return render(request, "network/index.html", {"posts": posts, "success": "Post is published"})

    return render(request, "network/index.html", {"posts": posts})


@csrf_exempt
@login_required
def like_post(request):
    if not request.method == "POST":
        return JsonResponse({"error": "Only Post requests are accepted"})

    data = json.loads(request.body)
    post = Post.objects.get(pk=data.get("post_id"))
    try:
        like = Like.objects.get(user=request.user, post=post)
        like.delete()
        return JsonResponse({"message": "Successfully unliked the post."}, status=201)
    except Like.DoesNotExist:
        like = Like(user=request.user, post=post)
        like.save()
        return JsonResponse({"message": "Successfully liked a post."}, status=200)


@login_required
def profile(request, username):
    user = User.objects.get(username=username)
    liked_posts = Like.objects.filter(user=request.user)
    posts = user.posts.prefetch_related(
        Prefetch("likes", queryset=liked_posts, to_attr="is_liked")
    )[::-1]
    followed = user in request.user.following.all()

    return render(
        request,
        "network/index.html",
        {"posts": posts, "user_profile": user, "followed": followed},
    )


@csrf_exempt
@login_required
def follow(request):
    if request.method == "POST":
        data = json.loads(request.body)
        try:
            user_profile = User.objects.get(data.get("user_profile"))
            follow_rec = Follow.objects.get(
                follower=request.user, following=user_profile
            )
            follow_rec.delete()
            return JsonResponse(
                {"message": f"You have unfollowed {user_profile.username}."}, status=201
            )
        except Follow.DoesNotExist:
            new_follow = Follow(follower=request.user, following=user_profile)
            new_follow.save()
            return JsonResponse(
                {"message": f"You have followed {user_profile.username}."}, status=201
            )

    return render(request, "network/index.html", {})


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(
                request,
                "network/login.html",
                {"message": "Invalid username and/or password."},
            )
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(
                request, "network/register.html", {"message": "Passwords must match."}
            )

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(
                request, "network/register.html", {"message": "Username already taken."}
            )
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
