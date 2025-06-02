from rest_framework import serializers
from .models import Service, UploadedMedia

class UploadedMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedMedia
        fields = ['id', 'media_type', 'file', 'external_url', 'uploaded_at']

    def validate(self, data):
        media_type = data.get('media_type')
        file = data.get('file')
        url = data.get('external_url')

        if media_type == 'url' and not url:
            raise serializers.ValidationError("External URL is required for media_type='url'.")
        if media_type in ['image', 'video'] and not file:
            raise serializers.ValidationError("File is required for media_type='image' or 'video'.")
        return data

class ServiceSerializer(serializers.ModelSerializer):
    media = UploadedMediaSerializer(many=True, read_only=True)

    class Meta:
        model = Service
        fields = ['id', 'name', 'category', 'description', 'price', 'whats_included', 'media']
