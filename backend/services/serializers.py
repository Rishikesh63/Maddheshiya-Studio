from rest_framework import serializers
from .models import Service, UploadedMedia, Package, PortfolioItem, PortfolioCategory


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


class AdminServiceSerializer(serializers.ModelSerializer):
    media = UploadedMediaSerializer(many=True, read_only=True)

    class Meta:
        model = Service
        fields = [
            'id', 'name', 'slug', 'main_category', 'subcategory', 'description',
            'short_description', 'image', 'thumbnail', 'base_price', 'is_active',
            'is_featured', 'whats_included', 'media',
        ]
        read_only_fields = ['id', 'slug']


class AdminPackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package
        fields = [
            'id', 'name', 'slug', 'service_type', 'category', 'description',
            'price', 'features', 'duration', 'deliverables', 'images', 'is_featured',
        ]
        read_only_fields = ['id', 'slug']


class AdminPortfolioCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioCategory
        fields = ['id', 'name', 'slug', 'icon', 'description', 'color']
        read_only_fields = ['id', 'slug']


class AdminPortfolioItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioItem
        fields = [
            'id', 'title', 'slug', 'category', 'thumbnail', 'gallery',
            'video_url', 'reel_url', 'client_name', 'client_email', 'location',
            'service_type', 'description', 'story', 'is_featured', 'display_order',
        ]
        read_only_fields = ['id', 'slug']
