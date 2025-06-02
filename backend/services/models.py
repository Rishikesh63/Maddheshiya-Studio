from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

SERVICE_CATEGORIES = [
    ('profesional_photography', 'Photography'),
    ('videography', 'Videography'),
    ('ai_powered_editing','AI Powered Editing'),
    ('custom_tshirt_printing','Custom T-Shirt Printing'),
    ('drone_footage', 'Drone Footage'),
    ('e_commerce_photography','E-Commerce Photography'),
    ('id_card_making', 'ID Card Making'),
    ('tshirt_printing', 'T-Shirt Printing'),
    ('albumb_designing','Album Designing'),
    ('photo_framing', 'Photo Framing'),
    ('ai_assistant', 'AI Assistant Development'),
]

class Service(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=SERVICE_CATEGORIES)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    whats_included = models.TextField(help_text="Enter one item per line")
    
    def get_whats_included_list(self):
        return [item.strip() for item in self.whats_included.strip().splitlines() if item.strip()]

    def __str__(self):
        return f"{self.name} - {self.category}"

MEDIA_TYPE_CHOICES = [
    ('image', 'Image'),
    ('video', 'Video'),
    ('url', 'External URL'),
]

class UploadedMedia(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="media")
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES)
    file = models.FileField(upload_to="service_uploads/", blank=True, null=True)
    external_url = models.URLField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.media_type} - {self.file or self.external_url}"
