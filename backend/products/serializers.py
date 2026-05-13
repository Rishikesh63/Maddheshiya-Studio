from rest_framework import serializers
from .models import ProductCategory, Product, ProductSample, ProductFeature


class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = ['id', 'name', 'slug', 'category_type', 'description', 'icon', 'image', 'order']


class ProductSampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSample
        fields = ['id', 'image', 'title', 'description', 'order']


class ProductFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductFeature
        fields = ['id', 'feature_name', 'feature_value', 'order']


class ProductListSerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer(read_only=True)
    current_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    has_discount = serializers.BooleanField(read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'short_description',
            'thumbnail', 'price', 'discount_price', 'current_price',
            'has_discount', 'discount_percentage', 'status', 'featured',
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer(read_only=True)
    samples = ProductSampleSerializer(many=True, read_only=True)
    features = ProductFeatureSerializer(many=True, read_only=True)
    current_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    has_discount = serializers.BooleanField(read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    is_in_stock = serializers.BooleanField(read_only=True)
    customization_options_list = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'description', 'short_description',
            'thumbnail', 'hero_image', 'price', 'discount_price', 'current_price',
            'has_discount', 'discount_percentage', 'status', 'stock', 'is_in_stock',
            'delivery_timeframe', 'customization_available', 'customization_options',
            'customization_options_list', 'featured', 'samples', 'features',
        ]

    def get_customization_options_list(self, obj):
        if obj.customization_options:
            return [o.strip() for o in obj.customization_options.split(',') if o.strip()]
        return []
