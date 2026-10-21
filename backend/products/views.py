from rest_framework import viewsets, filters, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, BasePermission
from .models import ProductCategory, Product, ProductSample, ProductDimension
from .serializers import (
    ProductCategorySerializer, ProductListSerializer, ProductDetailSerializer,
    AdminProductWriteSerializer, AdminProductCategoryWriteSerializer,
    AdminProductSampleSerializer, AdminProductDimensionSerializer,
)


class IsAdminUserCustom(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_admin_user)


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


class AdminProductViewSet(viewsets.ModelViewSet):
    """Full CRUD for products — admin only."""
    permission_classes = [IsAdminUserCustom]
    serializer_class = AdminProductWriteSerializer
    lookup_field = 'id'

    def get_queryset(self):
        return Product.objects.select_related('category').order_by('category', 'order')

    def get_serializer_class(self):
        if self.action in ('list', 'retrieve'):
            return ProductDetailSerializer
        return AdminProductWriteSerializer


class AdminProductCategoryViewSet(viewsets.ModelViewSet):
    """Full CRUD for product categories — admin only."""
    permission_classes = [IsAdminUserCustom]
    serializer_class = AdminProductCategoryWriteSerializer
    lookup_field = 'id'

    def get_queryset(self):
        return ProductCategory.objects.all().order_by('category_type', 'order')


class AdminProductSampleViewSet(viewsets.ModelViewSet):
    """CRUD for product gallery images — admin only."""
    permission_classes = [IsAdminUserCustom]
    serializer_class = AdminProductSampleSerializer
    lookup_field = 'id'

    def get_queryset(self):
        qs = ProductSample.objects.select_related('product').order_by('order', 'created_at')
        product_id = self.request.query_params.get('product')
        if product_id:
            qs = qs.filter(product_id=product_id)
        return qs


class AdminProductDimensionViewSet(viewsets.ModelViewSet):
    """CRUD for product dimensions/sizes with prices — admin only."""
    permission_classes = [IsAdminUserCustom]
    serializer_class = AdminProductDimensionSerializer
    lookup_field = 'id'

    def get_queryset(self):
        qs = ProductDimension.objects.select_related('product').order_by('order', 'size_id')
        product_id = self.request.query_params.get('product')
        if product_id:
            qs = qs.filter(product_id=product_id)
        return qs
