from django.contrib import admin
from .models import User, Post, Comment, Like, Follow

# Register your models here.
class PostAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "content", "timestamp")

class CommentAdmin(admin.ModelAdmin):
    list_display = ("id", "post", "user", "timestamp")

admin.site.register(User)
admin.site.register(Post, PostAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Like)
admin.site.register(Follow)
