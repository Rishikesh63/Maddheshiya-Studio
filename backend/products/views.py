from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import ProductCategory, Product
from .serializers import (
    ProductCategorySerializer, ProductListSerializer, ProductDetailSerializer,
)


class ProductCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProductCategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        qs = ProductCategory.objects.filter(is_active=True)
        category_type = self.request.query_params.get('category_type')
        if category_type:
            qs = qs.filter(category_type=category_type)
        return qs.order_by('category_type', 'order')


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'short_description']
    ordering_fields = ['price', 'order', 'created_at']
    ordering = ['category', 'order']
    lookup_field = 'slug'

    def get_queryset(self):
        qs = Product.objects.filter(status='active').select_related('category')
        category = self.request.query_params.get('category')
        category_type = self.request.query_params.get('category_type')
        featured = self.request.query_params.get('featured')
        if category:
            qs = qs.filter(category__slug=category)
        if category_type:
            qs = qs.filter(category__category_type=category_type)
        if featured and featured.lower() == 'true':
            qs = qs.filter(featured=True)
        return qs

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        return ProductDetailSerializer

    @action(detail=False, methods=['get'])
    def featured(self, request):
        qs = self.get_queryset().filter(featured=True)
        serializer = ProductListSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data)
