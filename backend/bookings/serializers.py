from rest_framework import serializers
from .models import Location, Package, AvailabilitySlot, Booking


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'name', 'slug', 'state', 'travel_charge', 'description']


class PackageSerializer(serializers.ModelSerializer):
    service_type_display = serializers.CharField(source='get_service_type_display', read_only=True)
    inclusions_list = serializers.SerializerMethodField()

    class Meta:
        model = Package
        fields = [
            'id', 'name', 'slug', 'service_type', 'service_type_display',
            'description', 'price', 'duration_hours', 'inclusions',
            'inclusions_list', 'advance_required', 'featured', 'order',
        ]

    def get_inclusions_list(self, obj):
        return [i.strip() for i in obj.inclusions.split(',') if i.strip()]


class AvailabilitySlotSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)
    location_id = serializers.PrimaryKeyRelatedField(
        queryset=Location.objects.all(), source='location', write_only=True
    )
    available_slots = serializers.IntegerField(read_only=True)
    is_available = serializers.BooleanField(read_only=True)

    class Meta:
        model = AvailabilitySlot
        fields = [
            'id', 'date', 'location', 'location_id', 'status',
            'max_slots', 'booked_slots', 'available_slots', 'is_available', 'notes',
        ]


class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            'customer_name', 'customer_email', 'customer_phone',
            'event_type', 'event_date', 'event_time',
            'location', 'venue_name', 'venue_address',
            'package', 'guest_count', 'notes',
        ]

    def validate_event_date(self, value):
        from django.utils import timezone
        if value < timezone.now().date():
            raise serializers.ValidationError("Event date cannot be in the past.")
        return value

    def create(self, validated_data):
        package = validated_data['package']
        location = validated_data['location']
        booking = Booking(**validated_data)
        booking.package_price = package.price
        booking.travel_charge = location.travel_charge
        booking.save()
        return booking


class BookingDetailSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)
    package = PackageSerializer(read_only=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    advance_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Booking
        fields = [
            'booking_id', 'customer_name', 'customer_email', 'customer_phone',
            'event_type', 'event_date', 'event_time', 'location', 'venue_name',
            'package', 'guest_count', 'package_price', 'travel_charge',
            'total_amount', 'advance_amount', 'payment_status', 'status',
            'notes', 'created_at',
        ]
