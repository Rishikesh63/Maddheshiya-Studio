from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import (
    EmailOrUsernameTokenObtainPairSerializer,
    RegisterSerializer,
    UserSerializer,
)
from .models import CustomUser


class EmailOrUsernameTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailOrUsernameTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

class UserDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class UsersRootView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({
            "register": "/api/users/register/",
            "me": "/api/users/me/"
        })
