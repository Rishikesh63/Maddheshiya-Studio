import json
import urllib.request
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
    _send_phone_otp,
)
from .models import CustomUser, EmailVerificationOTP, PhoneOTP


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


class GoogleAuthView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        access_token = request.data.get('access_token', '').strip()
        if not access_token:
            return Response({'error': 'Google access token is required.'}, status=400)

        # Verify token and get user info from Google
        try:
            req = urllib.request.Request(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                headers={'Authorization': f'Bearer {access_token}'},
            )
            with urllib.request.urlopen(req, timeout=5) as resp:
                payload = json.loads(resp.read())
        except Exception:
            return Response({'error': 'Invalid Google token. Please try again.'}, status=400)

        email = payload.get('email', '').strip().lower()
        if not email or not payload.get('email_verified'):
            return Response({'error': 'Could not verify your Google account email.'}, status=400)

        user = CustomUser.objects.filter(email__iexact=email).first()
        if user:
            # Activate if previously unverified via email registration
            if not user.is_active:
                user.is_active = True
                user.save(update_fields=['is_active'])
        else:
            base = email.split('@')[0]
            username = base
            counter = 1
            while CustomUser.objects.filter(username=username).exists():
                username = f'{base}{counter}'
                counter += 1
            user = CustomUser.objects.create_user(
                username=username,
                email=email,
                password=None,
                first_name=payload.get('given_name', ''),
                last_name=payload.get('family_name', ''),
                is_active=True,
            )

        refresh = RefreshToken.for_user(user)
        refresh['is_admin_user'] = user.is_admin_user
        refresh['is_superuser'] = user.is_superuser

        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })


class SendPhoneOTPView(APIView):
    """
    Send a login/signup OTP to the given phone number.
    If the phone is new, creates an inactive user (name required for new users).
    POST { phone, name }
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone = request.data.get('phone', '').strip()
        name  = request.data.get('name', '').strip()

        if not phone or len(phone) < 10:
            return Response({'error': 'Enter a valid 10-digit mobile number.'}, status=400)

        # Normalise: strip leading +91 / 0 so we store only 10 digits
        if phone.startswith('+91'):
            phone = phone[3:]
        elif phone.startswith('91') and len(phone) == 12:
            phone = phone[2:]
        phone = phone.lstrip('0')

        if len(phone) != 10 or not phone.isdigit():
            return Response({'error': 'Enter a valid 10-digit Indian mobile number.'}, status=400)

        user = CustomUser.objects.filter(phone=phone).first()

        if not user:
            # New user — name is required
            if not name:
                return Response({'error': 'Please enter your name to create an account.', 'is_new': True}, status=400)
            parts = name.split(' ', 1)
            base = f'user{phone[-4:]}'
            username = base
            counter = 1
            while CustomUser.objects.filter(username=username).exists():
                username = f'{base}{counter}'
                counter += 1
            user = CustomUser.objects.create_user(
                username=username,
                email=None,
                password=None,
                first_name=parts[0],
                last_name=parts[1] if len(parts) > 1 else '',
                phone=phone,
                is_active=False,
            )
        else:
            # Existing user — update name if provided and different
            if name:
                parts = name.split(' ', 1)
                changed = False
                if not user.first_name:
                    user.first_name = parts[0]; changed = True
                if len(parts) > 1 and not user.last_name:
                    user.last_name = parts[1]; changed = True
                if changed:
                    user.save(update_fields=['first_name', 'last_name'])

        otp_obj = PhoneOTP.generate_for(user)
        _send_phone_otp(phone, otp_obj.otp)

        return Response({'message': 'OTP sent to your mobile number.', 'is_new': not user.is_active})


class VerifyPhoneOTPView(APIView):
    """
    Verify phone OTP. Activates new users and returns JWT tokens.
    POST { phone, otp }
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone = request.data.get('phone', '').strip()
        otp   = request.data.get('otp', '').strip()

        if not phone or not otp:
            return Response({'error': 'Phone and OTP are required.'}, status=400)

        # Normalise
        if phone.startswith('+91'):
            phone = phone[3:]
        elif phone.startswith('91') and len(phone) == 12:
            phone = phone[2:]
        phone = phone.lstrip('0')

        try:
            user = CustomUser.objects.get(phone=phone)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Invalid OTP. Please try again.'}, status=400)

        otp_obj = (
            PhoneOTP.objects
            .filter(user=user, otp=otp, is_used=False)
            .order_by('-created_at')
            .first()
        )

        if not otp_obj:
            return Response({'error': 'Invalid OTP. Please check and try again.'}, status=400)

        if otp_obj.is_expired():
            return Response({'error': 'This OTP has expired. Please request a new one.'}, status=400)

        otp_obj.is_used = True
        otp_obj.save()

        if not user.is_active:
            user.is_active = True
            user.save(update_fields=['is_active'])

        refresh = RefreshToken.for_user(user)
        refresh['is_admin_user'] = user.is_admin_user
        refresh['is_superuser']  = user.is_superuser

        return Response({
            'access':  str(refresh.access_token),
            'refresh': str(refresh),
        })


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
