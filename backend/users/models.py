import random
import string
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class CustomUser(AbstractUser):
    is_creator = models.BooleanField(default=False)
    is_client = models.BooleanField(default=True)
    is_admin_user = models.BooleanField(default=False)
    phone = models.CharField(max_length=15, blank=True)
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    bio = models.TextField(blank=True)

    def __str__(self):
        return self.username


class EmailVerificationOTP(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='email_otps')
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def is_expired(self):
        return timezone.now() > self.created_at + timezone.timedelta(minutes=15)

    @classmethod
    def generate_for(cls, user):
        cls.objects.filter(user=user, is_used=False).delete()
        otp = ''.join(random.choices(string.digits, k=6))
        return cls.objects.create(user=user, otp=otp)
