from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
import json

from .models import User, Post, Comment, Like, Follow


def index(request):
    posts =  Post.objects.all()[::-1]
    return render(request, "network/index.html", {
        "posts": posts
    })

@csrf_exempt
@login_required
def create_post(request):
    if not request.method == "POST":
        return JsonResponse({"error": "Only POST request is allowed"})
    
    data = json.loads(request.body)
    content = data.get("content", "")
    if not content:
        return JsonResponse({"error": "Please type something."}, status=400)
    post  = Post(
        user = request.user,
        content = content
    )
    post.save()
    return JsonResponse({"message": "Post had been published.", "post": {
        "user": post.user.username,
        "content": post.content,
        "timestamp": post.timestamp
    }}, status=200)

@csrf_exempt
@login_required
def like_post(request):
    if not request.method == 'POST':
        return JsonResponse({"error": "Only Post requests are accepted"})
    
    data = json.loads(request.body)
    try:
        like = Like.objects.get(user=request.user, post=data.post)
        like.delete()
        return JsonResponse({"message": "Successfully unliked the post."}, status=200)
    except Like.DoesNotExist:
        like = Like(
            user=request.user,
            post=data.post
        )
        return JsonResponse({"message": "Successfully liked a post."}, status=200)

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
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
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
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
