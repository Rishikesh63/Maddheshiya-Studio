from django.urls import path
from .views import GearListCreateView, StudioListCreateView, RentalListCreateView

urlpatterns = [
    path('gear/', GearListCreateView.as_view(), name='gear-list-create'),
    path('studios/', StudioListCreateView.as_view(), name='studio-list-create'),
    path('rentals/', RentalListCreateView.as_view(), name='rental-list-create'),
]
