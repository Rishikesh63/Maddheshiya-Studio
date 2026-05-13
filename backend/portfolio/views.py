from rest_framework import viewsets, filters
from rest_framework.permissions import AllowAny
from .models import PortfolioCategory, PortfolioItem, ServiceCategory, Service
from .serializers import (
    PortfolioCategorySerializer, PortfolioItemSerializer,
    PortfolioItemListSerializer, ServiceCategorySerializer, ServiceSerializer,
)


class PortfolioCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PortfolioCategory.objects.all()
    serializer_class = PortfolioCategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


class PortfolioItemViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'client_name', 'service_type']
    ordering_fields = ['published_at', 'created_at']
    ordering = ['-published_at']
    lookup_field = 'slug'

    def get_queryset(self):
        qs = PortfolioItem.objects.filter(status='published').select_related('category')
        category = self.request.query_params.get('category')
        featured = self.request.query_params.get('featured')
        if category:
            qs = qs.filter(category__slug=category)
        if featured and featured.lower() == 'true':
            qs = qs.filter(featured=True)
        return qs

    def get_serializer_class(self):
        if self.action == 'list':
            return PortfolioItemListSerializer
        return PortfolioItemSerializer


class ServiceCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = ServiceSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        qs = Service.objects.filter(status='active').select_related('category')
        category = self.request.query_params.get('category')
        featured = self.request.query_params.get('featured')
        if category:
            qs = qs.filter(category__slug=category)
        if featured and featured.lower() == 'true':
            qs = qs.filter(featured=True)
        return qs
