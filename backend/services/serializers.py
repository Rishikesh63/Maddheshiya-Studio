from rest_framework import serializers
from .models import Service, UploadedMedia

class UploadedMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedMedia
        fields = ['id', 'image', 'uploaded_at']

class ServiceSerializer(serializers.ModelSerializer):
    media = UploadedMediaSerializer(many=True, read_only=True)

    class Meta:
        model = Service
        fields = ['id', 'name', 'category', 'description', 'price', 'whats_included', 'media']
