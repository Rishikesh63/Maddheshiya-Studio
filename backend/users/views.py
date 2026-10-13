from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (
    EmailOrUsernameTokenObtainPairSerializer,
    RegisterSerializer,
    UserSerializer,
    _send_otp_email,
)
from .models import CustomUser, EmailVerificationOTP


class EmailOrUsernameTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailOrUsernameTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 401:
            identifier = request.data.get('username', '')
            try:
                user = CustomUser.objects.get(email__iexact=identifier)
                if not user.is_active:
                    return Response(
                        {'detail': 'email_not_verified', 'email': user.email},
                        status=status.HTTP_401_UNAUTHORIZED,
                    )
            except CustomUser.DoesNotExist:
                pass
        return response


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer


class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        otp   = request.data.get('otp', '').strip()

        if not email or not otp:
            return Response({'error': 'Email and OTP are required.'}, status=400)

        try:
            user = CustomUser.objects.get(email__iexact=email)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Invalid code. Please try again.'}, status=400)

        if user.is_active:
            return Response({'error': 'This account is already verified.'}, status=400)

        otp_obj = (
            EmailVerificationOTP.objects
            .filter(user=user, otp=otp, is_used=False)
            .order_by('-created_at')
            .first()
        )

        if not otp_obj:
            return Response({'error': 'Invalid code. Please check and try again.'}, status=400)

        if otp_obj.is_expired():
            return Response({'error': 'This code has expired. Please request a new one.'}, status=400)

        otp_obj.is_used = True
        otp_obj.save()
        user.is_active = True
        user.save(update_fields=['is_active'])

        # Issue JWT tokens so user is immediately logged in after verification
        refresh = RefreshToken.for_user(user)
        refresh['is_admin_user'] = user.is_admin_user
        refresh['is_superuser'] = user.is_superuser

        return Response({
            'refresh': str(refresh),
            'access':  str(refresh.access_token),
        })


class ResendOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()

        if not email:
            return Response({'error': 'Email is required.'}, status=400)

        try:
            user = CustomUser.objects.get(email__iexact=email)
        except CustomUser.DoesNotExist:
            return Response({'message': 'If this email is registered and awaiting verification, a new code has been sent.'})

        if user.is_active:
            return Response({'error': 'This account is already verified.'}, status=400)

        otp_obj = EmailVerificationOTP.generate_for(user)
        _send_otp_email(user.email, otp_obj.otp, user.first_name)

        return Response({'message': 'A new verification code has been sent to your email.'})


class UserDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class UsersRootView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({
            "register":     "/api/users/register/",
            "verify-email": "/api/users/verify-email/",
            "resend-otp":   "/api/users/resend-otp/",
            "me":           "/api/users/me/",
        })
