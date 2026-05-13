from rest_framework import serializers
from .models import PortfolioCategory, PortfolioItem, PortfolioGalleryImage, PortfolioReview, ServiceCategory, Service


class PortfolioCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioCategory
        fields = ['id', 'name', 'slug', 'description', 'icon']


class PortfolioGalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioGalleryImage
        fields = ['id', 'image', 'caption', 'order']


class PortfolioReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioReview
        fields = ['id', 'client_name', 'rating', 'comment', 'verified', 'created_at']


class PortfolioItemListSerializer(serializers.ModelSerializer):
    category = PortfolioCategorySerializer(read_only=True)

    class Meta:
        model = PortfolioItem
        fields = ['id', 'title', 'slug', 'category', 'thumbnail', 'service_type', 'featured', 'published_at']


class PortfolioItemSerializer(serializers.ModelSerializer):
    category = PortfolioCategorySerializer(read_only=True)
    gallery_images = PortfolioGalleryImageSerializer(many=True, read_only=True)
    reviews = PortfolioReviewSerializer(many=True, read_only=True)

    class Meta:
        model = PortfolioItem
        fields = [
            'id', 'title', 'slug', 'category', 'thumbnail', 'gallery',
            'video_url', 'client_name', 'location', 'description',
            'service_type', 'featured', 'status', 'gallery_images',
            'reviews', 'created_at', 'published_at',
        ]


class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = ['id', 'name', 'slug', 'description', 'icon', 'image', 'order']


class ServiceSerializer(serializers.ModelSerializer):
    category = ServiceCategorySerializer(read_only=True)

    class Meta:
        model = Service
        fields = [
            'id', 'name', 'slug', 'category', 'description',
            'short_description', 'hero_image', 'icon', 'status', 'featured', 'order',
        ]
