import uuid
from django.db import models


class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
    ]

    razorpay_order_id = models.CharField(max_length=100, unique=True)
    razorpay_payment_id = models.CharField(max_length=100, null=True, blank=True)
    razorpay_signature = models.CharField(max_length=500, null=True, blank=True)

    customer_name = models.CharField(max_length=200)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)

    amount = models.IntegerField()  # stored in paise (₹1 = 100 paise)
    items = models.JSONField()      # [{id, title, price, downloadPath}]

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    download_token = models.UUIDField(default=uuid.uuid4, unique=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.razorpay_order_id} — {self.customer_name} — {self.status}"
