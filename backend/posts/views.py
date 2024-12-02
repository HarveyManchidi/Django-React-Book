from rest_framework import generics, permissions, status, views 
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser

from posts.models import ( 
    Post,
    Comment,
    Like,  
)
from posts.serializers import (
    CommentSerializer, 
    PostCommentSerializer, # new
    PostSerializer,  
)


# Create your views here.
class PostView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PostSerializer
    parser_classes = [MultiPartParser]
    queryset = Post.objects.all()

class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PostCommentSerializer
    queryset = Post.objects.all()

class CommentView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CommentSerializer
    queryset  = Comment.objects.all()

class CommentDetailView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

class ProfilePostsView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PostSerializer
    def get_queryset(self):
        user_id = self.kwargs['pk']
        return Post.objects.filter(author=user_id)

class LikeUnlikeView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, pk):
        author = self.request.user
        post = Post.objects.get(id=pk)

        if Like.objects.filter(author=author, post=post).exists():
            return Response({"detail": "Liked"})
        else:
            return Response({"detail": "You did not like this post"})

    def post(self, request, pk):
        author = self.request.user
        posted = Post.objects.get(id=pk)

        if Like.objects.filter(author=author, post=posted).exists():
            return Response(
                {"detail": "You already liked this post"},
                status=status.HTTP_200_OK,
            )
        else:
            Like.objects.create(author=author, post=posted)
            return Response(
                {"detail": "You now like this post"},
                 status=status.HTTP_201_CREATED)

    def delete(self, request, pk):
        author = self.request.user
        post = Post.objects.get(id=pk)

        if Like.objects.filter(author=author, post=post).exists():
            liked = Like.objects.filter(author=author, post=post)
            liked.delete()
            return Response(
                {"detail": "You unliked this post."}, status=status.HTTP_200_OK
            )
