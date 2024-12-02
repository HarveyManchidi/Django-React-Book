from rest_framework import serializers
from .models import Follow, Profile
from django.contrib.auth.models import User

class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = ['id','followed','follower']

class FollowerSerializer(serializers.ModelSerializer):
    follower_username = serializers.SerializerMethodField()
    class Meta:
        model = Follow
        fields = '__all__'
    
    def get_follower_username(self, obj):
        return obj.follower.username 

class ProfileSerializer(serializers.ModelSerializer):
    total_followers = serializers.SerializerMethodField()
    class Meta:
        model = Profile
        fields = '__all__'
    
    def get_total_followers(self, obj):
        return obj.user.followers.count() 

class UserProfileSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    
    class Meta(ProfileSerializer.Meta):
        model = User
        fields = ['id','username','email','profile']

    def update(self, instance, validated_data):
        # Extract profile data
        profile_data = validated_data.pop('profile', None)

        # Update user fields
        instance.username = validated_data.get('username', instance.username)
        instance.save()

        # Update profile fields if profile data is provided
        if profile_data:
            profile = instance.profile  # Get the related Profile instance
            profile.bio = profile_data.get('bio', profile.bio)
            profile.profile_image = profile_data.get('profile_image', 
                profile.profile_image)
            profile.save()

        return instance
