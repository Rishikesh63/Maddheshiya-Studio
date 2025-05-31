from rest_framework import generics
from .models import Gear, Studio, Rental
from .serializers import GearSerializer, StudioSerializer, RentalSerializer

class GearListCreateView(generics.ListCreateAPIView):
    queryset = Gear.objects.all()
    serializer_class = GearSerializer

class StudioListCreateView(generics.ListCreateAPIView):
    queryset = Studio.objects.all()
    serializer_class = StudioSerializer

class RentalListCreateView(generics.ListCreateAPIView):
    queryset = Rental.objects.all()
    serializer_class = RentalSerializer