from rest_framework import serializers
from accounts.models import Profile
from .models import Post, Comment

class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.SerializerMethodField()
    comment_profile_image = serializers.SerializerMethodField()
    class Meta:
        model = Comment
        fields = ('__all__')

    def get_author_username(self, obj):
        return obj.author.username 
    
    def get_comment_profile_image(self, obj):
        return "http://127.0.0.1:8000/media/"+str(Profile.objects.get(user=obj.author.id).profile_image)

class PostCommentSerializer(serializers.ModelSerializer):
    author_username = serializers.SerializerMethodField()
    total_likes = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True)
    
    class Meta:
        model = Post
        fields = '__all__'
    
    def get_author_username(self, obj):
        return obj.author.username 
    
    def get_total_likes(self,obj):
        return obj.likes.count()

class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.SerializerMethodField()
    total_likes = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = '__all__'

    def get_author_username(self, obj):
        return obj.author.username
    
    def get_total_likes(self,obj):
        return obj.likes.count()
