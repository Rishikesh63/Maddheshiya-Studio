from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LocationViewSet, PackageViewSet, AvailabilityViewSet, BookingViewSet

router = DefaultRouter()
router.register('locations', LocationViewSet, basename='location')
router.register('packages', PackageViewSet, basename='package')
router.register('availability', AvailabilityViewSet, basename='availability')
router.register('bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path('', include(router.urls)),
]
