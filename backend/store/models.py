from django.db import models
from users.models import CustomUser

class Studio(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    hourly_rate = models.DecimalField(max_digits=6, decimal_places=2)
    is_available = models.BooleanField(default=True)

class Gear(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    rental_rate = models.DecimalField(max_digits=6, decimal_places=2)  # per day
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    is_listed = models.BooleanField(default=True)
    is_rented = models.BooleanField(default=False)

class Rental(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    gear = models.ForeignKey(Gear, on_delete=models.CASCADE, null=True, blank=True)
    studio = models.ForeignKey(Studio, on_delete=models.CASCADE, null=True, blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    is_confirmed = models.BooleanField(default=False)
