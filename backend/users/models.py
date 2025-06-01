from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    is_creator = models.BooleanField(default=False)
    is_client = models.BooleanField(default=True)
    password = models.CharField(max_length=100)
    phone = models.CharField(max_length=15, blank=True)
    profile_image = models.ImageField(upload_to='profiles/', blank=True)
    bio = models.TextField(blank=True)    
