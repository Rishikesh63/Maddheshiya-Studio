from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Location, Package, AvailabilitySlot, Booking
from .serializers import (
    LocationSerializer, PackageSerializer,
    AvailabilitySlotSerializer, BookingCreateSerializer, BookingDetailSerializer,
)


class LocationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Location.objects.filter(is_active=True).order_by('name')
    serializer_class = LocationSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


class PackageViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PackageSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        qs = Package.objects.filter(is_active=True).order_by('service_type', 'order', 'price')
        service_type = self.request.query_params.get('service_type')
        featured = self.request.query_params.get('featured')
        if service_type:
            qs = qs.filter(service_type=service_type)
        if featured and featured.lower() == 'true':
            qs = qs.filter(featured=True)
        return qs


class AvailabilityViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AvailabilitySlotSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = AvailabilitySlot.objects.select_related('location')
        month = self.request.query_params.get('month')
        location = self.request.query_params.get('location')
        if month:
            try:
                year, mon = month.split('-')
                qs = qs.filter(date__year=int(year), date__month=int(mon))
            except (ValueError, AttributeError):
                pass
        if location:
            qs = qs.filter(location__slug=location)
        return qs.order_by('date')


class BookingViewSet(viewsets.GenericViewSet):
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'create':
            return BookingCreateSerializer
        return BookingDetailSerializer

    def create(self, request):
        serializer = BookingCreateSerializer(data=request.data)
        if serializer.is_valid():
            booking = serializer.save()
            return Response(
                BookingDetailSerializer(booking).data,
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='lookup')
    def lookup(self, request):
        booking_id = request.query_params.get('booking_id')
        if not booking_id:
            return Response({'error': 'booking_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            booking = Booking.objects.get(booking_id=booking_id)
            return Response(BookingDetailSerializer(booking).data)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
