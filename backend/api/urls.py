from django.urls import path
from posts import views as posts_views 
from accounts import views as accounts_views

from api.views import MyTokenObtainPairView 
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenObtainPairView
)


urlpatterns =[
    path('posts/',posts_views.PostView.as_view()),
    path('posts/<int:pk>/',posts_views.PostDetailView.as_view()),
    path('posts/comments/', posts_views.CommentView.as_view()),
    path('posts/comments/<int:pk>/',posts_views.CommentDetailView.as_view()),
    path('posts/<int:pk>/like/',posts_views.LikeUnlikeView.as_view()),

    path('users/<int:pk>/profile/posts/',posts_views.ProfilePostsView.as_view()),
    path('users/<int:pk>/profile/',accounts_views.ProfileView.as_view()),
    path('users/<int:pk>/profile/edit/',accounts_views.ProfileView.as_view()),
    path('users/<int:pk>/profile/followers/', accounts_views.FollowerView.as_view()),
    path('users/<int:pk>/profile/follow/',accounts_views.FollowView.as_view()),

    path('token/',MyTokenObtainPairView.as_view(),name='token_obtain_pair'), # new
    path('token/refresh/',TokenRefreshView.as_view(),name='token_refresh'), # new  


]
