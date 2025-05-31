from django.urls import path
from .views import ServiceListCreateView, BookingListCreateView

urlpatterns = [
    path('services/', ServiceListCreateView.as_view(), name='service-list-create'),
    path('bookings/', BookingListCreateView.as_view(), name='booking-list-create'),
]
