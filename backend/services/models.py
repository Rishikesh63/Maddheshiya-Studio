from django.db import models
from users.models import CustomUser

class Service(models.Model):
    CATEGORY_CHOICES = [
        ('wedding', 'Wedding'),
        ('event', 'Event'),
        ('product', 'Product Shoot'),
        ('drone', 'Drone Footage'),
        ('vr', 'VR Experience'),
    ]

    title = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class Booking(models.Model):
    client = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='bookings')
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    event_date = models.DateField()
    location = models.CharField(max_length=255)
    notes = models.TextField(blank=True)
    is_confirmed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
