from rest_framework import generics, permissions, status, views
from rest_framework.response import Response

from accounts.models import Profile, Follow # new
from accounts.serializers import UserProfileSerializer, FollowerSerializer # new
from django.contrib.auth.models import User # new
# Create your views here.

class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserProfileSerializer
    queryset = User.objects.all()

class FollowerView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FollowerSerializer

    def get_queryset(self): 
        userId = self.kwargs['pk'] 
        return Follow.objects.filter(followed=userId)

class FollowView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        follower = self.request.user
        followed = User.objects.get(id=pk)

        if Follow.objects.filter(follower=follower, followed=followed).exists():
            return Response(
                {"detail": "Followed"},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"detail": "You are not following this account"},
                status=status.HTTP_200_OK,
                )

    def post(self, request, pk):
        follower = self.request.user
        followed = User.objects.get(id=pk)

        if Follow.objects.filter(follower=follower, followed=followed).exists():
            return Response(
                {"detail": "Followed"},
                status=status.HTTP_200_OK,
            )
        else:
            Follow.objects.create(follower=follower, followed=followed)
            return Response(
                {"detail": "You are now following this user."},
                status=status.HTTP_201_CREATED,
        )

    def delete(self, request, pk):
        follower = self.request.user
        followed = User.objects.get(id=pk)

        if Follow.objects.filter(follower=follower, followed=followed).exists():
            account = Follow.objects.filter(follower=follower, followed=followed)
            account.delete()
            return Response(
                {"detail": "You unfollowed this user."},
                status=status.HTTP_200_OK,
            )
