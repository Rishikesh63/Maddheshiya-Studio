from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

admin_router = DefaultRouter()
admin_router.register('services', views.AdminServiceViewSet, basename='admin-service')
admin_router.register('packages', views.AdminPackageViewSet, basename='admin-package')
admin_router.register('portfolio-categories', views.AdminPortfolioCategoryViewSet, basename='admin-portfolio-category')
admin_router.register('portfolio-items', views.AdminPortfolioItemViewSet, basename='admin-portfolio-item')

urlpatterns = [
    path('services/', views.ServiceListView.as_view(), name='service-list'),
    path('services/<int:id>/', views.ServiceDetailView.as_view(), name='service-detail'),
    path('services/<int:service_id>/upload/', views.UploadMediaView.as_view(), name='upload-media'),
    path('admin/', include(admin_router.urls)),
]

