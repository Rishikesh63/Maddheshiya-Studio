from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone
from django.contrib.auth import get_user_model

User = get_user_model()


class Location(models.Model):
    """Operating cities and venues"""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    state = models.CharField(max_length=100)
    travel_charge = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name}, {self.state}"


class Package(models.Model):
    """Service packages"""
    SERVICE_TYPE_CHOICES = [
        ('photography', 'Photography'),
        ('videography', 'Videography'),
        ('hybrid', 'Hybrid (Photo + Video)'),
    ]

    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    service_type = models.CharField(
        max_length=50,
        choices=SERVICE_TYPE_CHOICES
    )
    description = models.TextField()
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    duration_hours = models.IntegerField(
        validators=[MinValueValidator(1)]
    )
    inclusions = models.TextField(
        help_text='Comma-separated list of inclusions'
    )
    
    # Restrictions
    max_events = models.IntegerField(
        null=True,
        blank=True,
        help_text='Max bookings per month'
    )
    advance_required = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=50,
        help_text='Advance payment percentage'
    )
    
    featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['service_type', 'order', 'price']

    def __str__(self):
        return f"{self.name} - {self.get_service_type_display()}"


class AvailabilitySlot(models.Model):
    """Availability calendar"""
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('booked', 'Booked'),
        ('limited', 'Limited'),
        ('blocked', 'Blocked'),
    ]

    date = models.DateField()
    location = models.ForeignKey(
        Location,
        on_delete=models.CASCADE,
        related_name='availability_slots'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='available'
    )
    max_slots = models.IntegerField(default=1)
    booked_slots = models.IntegerField(default=0)
    notes = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('date', 'location')
        ordering = ['date', 'location']
        indexes = [
            models.Index(fields=['date', 'location', 'status']),
            models.Index(fields=['date', 'status']),
        ]

    def __str__(self):
        return f"{self.date} - {self.location.name} ({self.get_status_display()})"

    @property
    def available_slots(self):
        return self.max_slots - self.booked_slots

    @property
    def is_available(self):
        return self.status == 'available' and self.available_slots > 0


class Booking(models.Model):
    """Service bookings"""
    STATUS_CHOICES = [
        ('inquiry', 'Inquiry'),
        ('tentative', 'Tentative'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
    ]

    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('advance_paid', 'Advance Paid'),
        ('fully_paid', 'Fully Paid'),
        ('refunded', 'Refunded'),
    ]

    # Booking reference
    booking_id = models.CharField(
        max_length=20,
        unique=True,
        editable=False
    )
    
    # Customer info
    customer_name = models.CharField(max_length=255)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='bookings'
    )
    
    # Event details
    event_type = models.CharField(
        max_length=100,
        help_text='e.g., Wedding, Pre-wedding, Corporate Event'
    )
    event_date = models.DateField()
    event_time = models.TimeField(
        null=True,
        blank=True
    )
    
    # Location & venue
    location = models.ForeignKey(
        Location,
        on_delete=models.PROTECT,
        related_name='bookings'
    )
    venue_name = models.CharField(max_length=255, blank=True)
    venue_address = models.TextField(blank=True)
    
    # Package & pricing
    package = models.ForeignKey(
        Package,
        on_delete=models.PROTECT,
        related_name='bookings'
    )
    guest_count = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1)]
    )
    
    # Pricing breakdown
    package_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    travel_charge = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    additional_charges = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    discount = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    
    @property
    def total_amount(self):
        return (
            self.package_price +
            self.travel_charge +
            self.additional_charges -
            self.discount
        )
    
    @property
    def advance_amount(self):
        percentage = self.package.advance_required
        return (self.total_amount * percentage) / 100
    
    # Payment tracking
    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default='pending'
    )
    advance_paid = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    amount_paid = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    
    # Status & notes
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='inquiry'
    )
    notes = models.TextField(blank=True)
    cancellation_reason = models.TextField(blank=True)
    
    # Important dates
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-event_date', '-created_at']
        indexes = [
            models.Index(fields=['status', 'event_date']),
            models.Index(fields=['payment_status', 'status']),
            models.Index(fields=['customer_email']),
        ]

    def __str__(self):
        return f"{self.booking_id} - {self.customer_name}"

    def save(self, *args, **kwargs):
        if not self.booking_id:
            # Generate booking ID: BOOK-YYYYMMDD-XXXX
            today = timezone.now().strftime('%Y%m%d')
            random_suffix = str(int(timezone.now().timestamp()) % 10000).zfill(4)
            self.booking_id = f"BOOK-{today}-{random_suffix}"
        super().save(*args, **kwargs)

    @property
    def remaining_amount(self):
        return self.total_amount - self.amount_paid

    @property
    def is_paid(self):
        return self.payment_status == 'fully_paid'

    @property
    def can_cancel(self):
        return self.status not in ['completed', 'cancelled', 'no_show']


class BookingTimeline(models.Model):
    """Track booking status changes"""
    ACTION_CHOICES = [
        ('created', 'Booking Created'),
        ('status_updated', 'Status Updated'),
        ('payment_received', 'Payment Received'),
        ('confirmed', 'Booking Confirmed'),
        ('cancelled', 'Booking Cancelled'),
        ('completed', 'Booking Completed'),
        ('note_added', 'Note Added'),
    ]

    booking = models.ForeignKey(
        Booking,
        on_delete=models.CASCADE,
        related_name='timeline'
    )
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    description = models.TextField()
    changed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.booking.booking_id} - {self.get_action_display()}"
