from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PortfolioCategoryViewSet, PortfolioItemViewSet, ServiceCategoryViewSet, ServiceViewSet

router = DefaultRouter()
router.register('categories', PortfolioCategoryViewSet, basename='portfolio-category')
router.register('items', PortfolioItemViewSet, basename='portfolio-item')
router.register('service-categories', ServiceCategoryViewSet, basename='service-category')
router.register('services', ServiceViewSet, basename='portfolio-service')

urlpatterns = [
    path('', include(router.urls)),
]
