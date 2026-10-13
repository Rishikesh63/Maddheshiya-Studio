from rest_framework import serializers
from .models import CustomUser, EmailVerificationOTP
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core.mail import EmailMultiAlternatives
from django.conf import settings


def _send_otp_email(to_email: str, otp: str, first_name: str = '') -> None:
    greeting = f"Hi {first_name}," if first_name else "Hello,"
    subject = "Verify your email — Maddheshiya Studio"
    text_body = (
        f"{greeting}\n\n"
        f"Your email verification code is:\n\n"
        f"  {otp}\n\n"
        f"This code expires in 15 minutes.\n\n"
        f"If you did not register with Maddheshiya Studio, you can ignore this email.\n\n"
        f"— Maddheshiya Studio"
    )
    html_body = f"""
<div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;background:#0a0a0a;color:#e8e0d0;padding:40px 32px;border:1px solid #c8a352;">
  <h1 style="font-size:22px;font-weight:300;letter-spacing:0.2em;color:#c8a352;margin:0 0 4px"">MADDHESHIYA</h1>
  <p style="font-size:10px;letter-spacing:0.5em;color:#888;margin:0 0 32px">STUDIO</p>
  <p style="font-size:14px;margin:0 0 8px">{greeting}</p>
  <p style="font-size:13px;color:#aaa;margin:0 0 24px">Use the code below to verify your email address.</p>
  <div style="background:#111;border:1px solid #c8a352;padding:20px;text-align:center;margin:0 0 24px">
    <span style="font-size:36px;letter-spacing:0.4em;color:#c8a352;font-family:monospace">{otp}</span>
  </div>
  <p style="font-size:11px;color:#666;margin:0">This code expires in <strong style="color:#aaa">15 minutes</strong>. If you did not create an account, please ignore this email.</p>
</div>
"""
    msg = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[to_email],
    )
    msg.attach_alternative(html_body, "text/html")
    try:
        msg.send()
    except Exception:
        pass  # fail_silently — OTP is still saved in DB


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    name = serializers.CharField(required=True, write_only=True)
    # username is sent by frontend for backward compat but we auto-generate it
    username = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = CustomUser
        ref_name = "CustomUserRegisterSerializer"
        fields = ['name', 'username', 'email', 'password', 'password2']

    def validate_email(self, value):
        existing = CustomUser.objects.filter(email__iexact=value).first()
        if existing:
            if not existing.is_active:
                # Resend OTP so they can complete verification
                otp_obj = EmailVerificationOTP.generate_for(existing)
                _send_otp_email(existing.email, otp_obj.otp, existing.first_name)
                raise serializers.ValidationError("awaiting_verification")
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        name = validated_data.pop('name')
        validated_data.pop('username', None)  # we auto-generate it
        email = validated_data['email']

        # Auto-generate a clean username from email (no spaces, unique)
        base = email.split('@')[0]
        username = base
        counter = 1
        while CustomUser.objects.filter(username=username).exists():
            username = f"{base}{counter}"
            counter += 1

        # Split name into first/last
        parts = name.strip().split(' ', 1)
        first_name = parts[0]
        last_name = parts[1] if len(parts) > 1 else ''

        user = CustomUser.objects.create_user(
            username=username,
            email=email,
            password=validated_data['password'],
            first_name=first_name,
            last_name=last_name,
            is_active=False,
        )

        otp_obj = EmailVerificationOTP.generate_for(user)
        _send_otp_email(user.email, otp_obj.otp, first_name)
        return user


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'name', 'first_name', 'last_name',
                  'phone', 'profile_image', 'bio', 'is_creator', 'is_client', 'is_admin_user', 'is_superuser']

    def get_name(self, obj):
        full = f"{obj.first_name} {obj.last_name}".strip()
        return full or obj.username


class EmailOrUsernameTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Accepts email as the username field.
    EmailBackend in AUTHENTICATION_BACKENDS handles the actual verification.
    """
    username_field = 'username'

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['is_admin_user'] = user.is_admin_user
        token['is_superuser'] = user.is_superuser
        return token

    def validate(self, attrs):
        return super().validate(attrs)
