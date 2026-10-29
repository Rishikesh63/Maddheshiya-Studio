from django.urls import path
from .views import (
    RegisterView, VerifyEmailView, ResendOTPView,
    SendPhoneOTPView, VerifyPhoneOTPView,
    UserDetailView, UsersRootView,
)

urlpatterns = [
    path('',                 UsersRootView.as_view(),      name='users-root'),
    path('register/',        RegisterView.as_view(),        name='register'),
    path('verify-email/',    VerifyEmailView.as_view(),     name='verify-email'),
    path('resend-otp/',      ResendOTPView.as_view(),       name='resend-otp'),
    path('send-phone-otp/',  SendPhoneOTPView.as_view(),    name='send-phone-otp'),
    path('verify-phone-otp/', VerifyPhoneOTPView.as_view(), name='verify-phone-otp'),
    path('me/',              UserDetailView.as_view(),      name='user-detail'),
]
