from django.urls import path
from .views import RegisterView, UserDetailView, UsersRootView

urlpatterns = [
     path('', UsersRootView.as_view(), name='users-root'),
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', UserDetailView.as_view(), name='user-detail'),
]
