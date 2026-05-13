from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from datetime import timedelta

User = get_user_model()

# ==================== SERVICE CATEGORIES ====================

SERVICE_MAIN_CATEGORIES = [
    ('photography', 'Photography'),
    ('videography', 'Videography'),
    ('products', 'Products'),
]

PHOTOGRAPHY_SUBCATEGORIES = [
    ('wedding', 'Wedding'),
    ('prewedding', 'Pre-Wedding'),
    ('studio', 'Studio'),
    ('product', 'Product'),
    ('drone', 'Drone'),
]

VIDEOGRAPHY_SUBCATEGORIES = [
    ('wedding-films', 'Wedding Films'),
    ('reels', 'Reels'),
    ('drone', 'Drone'),
    ('events', 'Events'),
]

PRODUCT_SUBCATEGORIES = [
    ('photo-psd', 'Photo PSD'),
    ('invitation-video', 'Invitation Video'),
    ('album-design', 'Album Design'),
    ('id-cards', 'ID Cards'),
    ('tshirt-printing', 'T-Shirt Printing'),
    ('photo-framing', 'Photo Framing'),
]

BOOKING_STATUS = [
    ('inquiry', 'Inquiry'),
    ('confirmed', 'Confirmed'),
    ('advance_paid', 'Advance Paid'),
    ('completed', 'Completed'),
    ('cancelled', 'Cancelled'),
]

AVAILABILITY_STATUS = [
    ('available', 'Available'),
    ('booked', 'Booked'),
    ('limited', 'Limited'),
    ('blocked', 'Blocked'),
]

MEDIA_TYPE_CHOICES = [
    ('image', 'Image'),
    ('video', 'Video'),
    ('url', 'External URL'),
]

# ==================== LOCATION MODEL ====================

class Location(models.Model):
    """Operational cities and service locations"""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    travel_charge = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

# ==================== PACKAGE MODEL ====================

class Package(models.Model):
    """Packages for services"""
    SERVICE_TYPE = [
        ('photography', 'Photography'),
        ('videography', 'Videography'),
        ('product', 'Product'),
    ]
    
    name = models.CharField(max_length=150)
    slug = models.SlugField(unique=True)
    service_type = models.CharField(max_length=50, choices=SERVICE_TYPE)
    category = models.CharField(max_length=50)  # wedding, prewedding, etc
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    features = models.TextField(help_text="One feature per line")
    duration = models.CharField(max_length=100, blank=True)  # "8 hours", "Full Day", etc
    deliverables = models.TextField(help_text="One deliverable per line")
    images = models.TextField(blank=True, help_text="Comma-separated image URLs")
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_featured', '-created_at']
        unique_together = ('name', 'category', 'service_type')
    
    def __str__(self):
        return f"{self.name} - {self.service_type}"
    
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Package.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)
    
    def get_features_list(self):
        return [f.strip() for f in self.features.strip().splitlines() if f.strip()]
    
    def get_deliverables_list(self):
        return [d.strip() for d in self.deliverables.strip().splitlines() if d.strip()]

# ==================== SERVICE MODEL (REFACTORED) ====================

class Service(models.Model):
    """Main service offerings"""
    name = models.CharField(max_length=150)
    slug = models.SlugField(unique=True, null=True, blank=True)
    main_category = models.CharField(max_length=50, choices=SERVICE_MAIN_CATEGORIES, null=True, blank=True)
    subcategory = models.CharField(max_length=100, blank=True)  # wedding, prewedding, etc
    description = models.TextField()
    short_description = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to='services/', null=True, blank=True)
    thumbnail = models.ImageField(upload_to='services/thumbnails/', null=True, blank=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    whats_included = models.TextField(blank=True, help_text="One item per line")
    
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_featured', '-created_at']
        unique_together = ('name', 'subcategory')
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Service.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)
    
    def get_whats_included_list(self):
        return [item.strip() for item in self.whats_included.strip().splitlines() if item.strip()]

# ==================== UPLOADED MEDIA MODEL ====================

class UploadedMedia(models.Model):
    """Media files for services and portfolio"""
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="media", null=True, blank=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES)
    file = models.FileField(upload_to="service_uploads/", blank=True, null=True)
    external_url = models.URLField(blank=True, null=True)
    title = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.media_type} - {self.title or self.file or self.external_url}"

# ==================== PORTFOLIO MODELS ====================

class PortfolioCategory(models.Model):
    """Categories for portfolio items"""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=50, blank=True)  # lucide-react icon names
    description = models.TextField(blank=True)
    color = models.CharField(max_length=20, default="from-purple-600 to-pink-600")
    
    class Meta:
        verbose_name_plural = "Portfolio Categories"
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

class PortfolioItem(models.Model):
    """Portfolio/case study items"""
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    category = models.ForeignKey(PortfolioCategory, on_delete=models.CASCADE, related_name='items')
    
    thumbnail = models.ImageField(upload_to='portfolio/thumbnails/')
    gallery = models.TextField(help_text="Comma-separated image URLs")
    
    video_url = models.URLField(blank=True, help_text="YouTube, Vimeo, or video file URL")
    reel_url = models.URLField(blank=True, help_text="Instagram reel or TikTok URL")
    
    client_name = models.CharField(max_length=150)
    client_email = models.EmailField(blank=True)
    location = models.CharField(max_length=150)
    
    service_type = models.CharField(max_length=100)  # wedding, prewedding, etc
    description = models.TextField()
    story = models.TextField(blank=True, help_text="The behind-the-scenes story")
    
    packages_used = models.ManyToManyField(Package, blank=True)
    
    is_featured = models.BooleanField(default=False)
    display_order = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_featured', '-display_order', '-created_at']
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while PortfolioItem.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)
    
    def get_gallery_list(self):
        return [img.strip() for img in self.gallery.strip().split(',') if img.strip()]

# ==================== PRODUCT MODEL ====================

class Product(models.Model):
    """Digital and physical products"""
    PRODUCT_TYPE = [
        ('digital', 'Digital'),
        ('printing', 'Printing'),
    ]
    
    name = models.CharField(max_length=150)
    slug = models.SlugField(unique=True)
    category = models.CharField(max_length=100, choices=PRODUCT_SUBCATEGORIES)
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPE)
    
    short_description = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='products/')
    gallery = models.TextField(blank=True, help_text="Comma-separated image URLs")
    
    price = models.DecimalField(max_digits=10, decimal_places=2)
    pricing_tiers = models.TextField(blank=True, help_text="JSON format for tiered pricing")
    
    features = models.TextField(help_text="One feature per line")
    delivery_timeline = models.CharField(max_length=100, help_text="e.g., 5-7 working days")
    customization_options = models.TextField(blank=True, help_text="One option per line")
    
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_featured', '-created_at']
        unique_together = ('name', 'category')
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Product.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)
    
    def get_features_list(self):
        return [f.strip() for f in self.features.strip().splitlines() if f.strip()]
    
    def get_customization_options(self):
        return [opt.strip() for opt in self.customization_options.strip().splitlines() if opt.strip()]

# ==================== BOOKING MODEL ====================

class Booking(models.Model):
    """Booking/order model"""
    booking_id = models.CharField(max_length=50, unique=True, db_index=True)
    
    # Customer info
    customer_name = models.CharField(max_length=150)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)
    customer_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Service info
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True)
    package = models.ForeignKey(Package, on_delete=models.SET_NULL, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Event info
    event_type = models.CharField(max_length=100)
    event_date = models.DateField()
    event_city = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True)
    venue_name = models.CharField(max_length=255, blank=True)
    
    # Additional info
    guest_count = models.IntegerField(null=True, blank=True)
    special_requirements = models.TextField(blank=True)
    
    # Pricing
    package_price = models.DecimalField(max_digits=10, decimal_places=2)
    travel_charges = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    advance_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Status
    status = models.CharField(max_length=20, choices=BOOKING_STATUS, default='inquiry')
    advance_paid = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['booking_id']),
            models.Index(fields=['event_date']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"Booking {self.booking_id} - {self.customer_name}"
    
    def save(self, *args, **kwargs):
        if not self.booking_id:
            import uuid
            from datetime import datetime
            self.booking_id = f"BK-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

# ==================== AVAILABILITY MODEL ====================

class AvailabilitySlot(models.Model):
    """Date availability for bookings"""
    date = models.DateField(db_index=True)
    status = models.CharField(max_length=20, choices=AVAILABILITY_STATUS, default='available')
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['date']
        unique_together = ('date',)
    
    def __str__(self):
        return f"{self.date} - {self.status}"

# ==================== TESTIMONIAL MODEL ====================

class Testimonial(models.Model):
    """Client testimonials (for future use - authentic only)"""
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, null=True, blank=True)
    client_name = models.CharField(max_length=150)
    client_image = models.ImageField(upload_to='testimonials/', null=True, blank=True)
    rating = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)], default=5)
    text = models.TextField()
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-is_featured', '-created_at']
    
    def __str__(self):
        return f"{self.client_name} - {self.rating}★"
