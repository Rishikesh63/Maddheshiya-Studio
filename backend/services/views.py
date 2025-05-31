from django.shortcuts import render
from rest_framework import generics
from .models import Service, Booking
from .serializers import ServiceSerializer, BookingSerializer
from django.http import Http404
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse

def home(request):
    return HttpResponse('Welocome to Maddheshiya Studio')

class ServiceListCreateView(generics.ListCreateAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

class BookingListCreateView(generics.ListCreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

