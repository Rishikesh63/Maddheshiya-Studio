from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        ref_name = "CustomUserRegisterSerializer"  # ✅ This resolves swagger conflict
        fields = [
            'username', 'email', 'password', 'password2',
            'is_creator', 'is_client', 'phone', 'bio', 'profile_image'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_creator=validated_data.get('is_creator', False),
            is_client=validated_data.get('is_client', True),
            phone=validated_data.get('phone', ''),
            bio=validated_data.get('bio', ''),
            profile_image=validated_data.get('profile_image', None)
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email',
            'phone', 'profile_image', 'bio',
            'is_creator', 'is_client'
        ]


class EmailOrUsernameTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'username'

    def validate(self, attrs):
        login = attrs.get('username') or attrs.get('email')

        if login and '@' in login:
            user = CustomUser.objects.filter(email__iexact=login).first()
            if user:
                attrs['username'] = user.get_username()

        return super().validate(attrs)
