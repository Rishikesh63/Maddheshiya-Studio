from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password','first_name', 'last_name', 'phone', 'is_creator', 'is_client', 'profile_image', 'bio']