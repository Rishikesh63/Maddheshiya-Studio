from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductCategoryViewSet, ProductViewSet, AdminProductViewSet, AdminProductCategoryViewSet

router = DefaultRouter()
router.register('categories', ProductCategoryViewSet, basename='product-category')
router.register('products', ProductViewSet, basename='product')

admin_router = DefaultRouter()
admin_router.register('products', AdminProductViewSet, basename='admin-product')
admin_router.register('categories', AdminProductCategoryViewSet, basename='admin-product-category')

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', include(admin_router.urls)),
]
