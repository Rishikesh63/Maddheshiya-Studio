from django.db import models
from django.core.validators import MinValueValidator, URLValidator
from django.utils.text import slugify
from django.utils import timezone


class ProductCategory(models.Model):
    """Product categories"""
    CATEGORY_TYPE_CHOICES = [
        ('digital', 'Digital Products'),
        ('printing', 'Printing Products'),
    ]

    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    category_type = models.CharField(
        max_length=20,
        choices=CATEGORY_TYPE_CHOICES
    )
    description = models.TextField(blank=True)
    icon = models.ImageField(
        upload_to='products/category_icons/',
        blank=True,
        null=True
    )
    image = models.ImageField(
        upload_to='products/category_images/',
        blank=True,
        null=True
    )
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Product Categories'
        ordering = ['category_type', 'order', 'name']
        unique_together = ('name', 'category_type')

    def __str__(self):
        return f"{self.name} ({self.get_category_type_display()})"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Product(models.Model):
    """Individual products"""
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('coming_soon', 'Coming Soon'),
        ('out_of_stock', 'Out of Stock'),
    ]

    DELIVERY_TIMEFRAME_CHOICES = [
        ('1-2', '1-2 Days'),
        ('3-5', '3-5 Days'),
        ('1-2 weeks', '1-2 Weeks'),
        ('2-4 weeks', '2-4 Weeks'),
        ('custom', 'Custom'),
    ]

    # Basic info
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    category = models.ForeignKey(
        ProductCategory,
        on_delete=models.PROTECT,
        related_name='products'
    )
    description = models.TextField()
    short_description = models.CharField(max_length=255, blank=True)
    
    # Media
    thumbnail = models.ImageField(
        upload_to='products/thumbnails/'
    )
    hero_image = models.ImageField(
        upload_to='products/hero/',
        blank=True,
        null=True
    )
    
    # Pricing & availability
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    discount_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)]
    )
    
    # Specifications
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active'
    )
    stock = models.IntegerField(
        default=-1,
        help_text='-1 for unlimited stock'
    )
    delivery_timeframe = models.CharField(
        max_length=20,
        choices=DELIVERY_TIMEFRAME_CHOICES,
        default='3-5'
    )
    customization_available = models.BooleanField(default=False)
    customization_options = models.TextField(
        blank=True,
        help_text='Comma-separated list of customization options'
    )
    
    # Display
    featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'order', 'name']
        indexes = [
            models.Index(fields=['category', 'status']),
            models.Index(fields=['status', 'featured']),
            models.Index(fields=['slug']),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def current_price(self):
        """Return discount price if available, otherwise regular price"""
        return self.discount_price or self.price

    @property
    def has_discount(self):
        return self.discount_price is not None and self.discount_price < self.price

    @property
    def discount_percentage(self):
        if self.has_discount:
            return int(((self.price - self.discount_price) / self.price) * 100)
        return 0

    @property
    def is_in_stock(self):
        return self.stock == -1 or self.stock > 0


class ProductSample(models.Model):
    """Product samples/gallery images"""
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='samples'
    )
    image = models.ImageField(
        upload_to='products/samples/%Y/%m/'
    )
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"{self.product.name} - Sample {self.order}"


class ProductFeature(models.Model):
    """Product features/specifications"""
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='features'
    )
    feature_name = models.CharField(max_length=255)
    feature_value = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"{self.product.name} - {self.feature_name}"


class ProductReview(models.Model):
    """Product reviews"""
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    customer_name = models.CharField(max_length=255)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    verified_purchase = models.BooleanField(default=False)
    helpful_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-helpful_count', '-created_at']

    def __str__(self):
        return f"{self.product.name} - {self.customer_name}"


class ProductOrder(models.Model):
    """Product orders"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('in_production', 'In Production'),
        ('ready_for_delivery', 'Ready for Delivery'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    order_id = models.CharField(
        max_length=20,
        unique=True,
        editable=False
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name='orders'
    )
    
    # Customer info
    customer_name = models.CharField(max_length=255)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)
    
    # Order details
    quantity = models.IntegerField(
        validators=[MinValueValidator(1)]
    )
    customization_details = models.TextField(
        blank=True,
        help_text='Custom specifications for this order'
    )
    
    # Pricing
    unit_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    shipping_address = models.TextField()
    
    # Status tracking
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    payment_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('paid', 'Paid'),
            ('refunded', 'Refunded'),
        ],
        default='pending'
    )
    tracking_number = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    
    # Dates
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expected_delivery = models.DateField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'customer_email']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.order_id} - {self.customer_name}"

    def save(self, *args, **kwargs):
        if not self.order_id:
            today = timezone.now().strftime('%Y%m%d')
            random_suffix = str(int(timezone.now().timestamp()) % 10000).zfill(4)
            self.order_id = f"PROD-{today}-{random_suffix}"
        super().save(*args, **kwargs)
