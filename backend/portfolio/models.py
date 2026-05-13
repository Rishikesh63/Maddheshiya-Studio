from django.db import models
from django.utils.text import slugify
from django.core.validators import URLValidator
from django.utils import timezone


class PortfolioCategory(models.Model):
    """Categories for portfolio items"""
    CATEGORY_CHOICES = [
        ('photography', 'Photography'),
        ('videography', 'Videography'),
        ('printing', 'Printing'),
        ('invitation-video', 'Invitation Video'),
        ('album-design', 'Album Design'),
        ('framing', 'Framing'),
    ]
    
    name = models.CharField(
        max_length=100,
        choices=CATEGORY_CHOICES,
        unique=True
    )
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True, null=True)
    icon = models.ImageField(
        upload_to='portfolio/category_icons/',
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Portfolio Categories'
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class PortfolioItem(models.Model):
    """Portfolio projects/cases"""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]
    
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    category = models.ForeignKey(
        PortfolioCategory,
        on_delete=models.PROTECT,
        related_name='items'
    )
    
    # Media
    thumbnail = models.ImageField(
        upload_to='portfolio/thumbnails/',
        help_text='Optimal size: 1200x800px'
    )
    gallery = models.ImageField(
        upload_to='portfolio/gallery/',
        blank=True,
        null=True
    )
    video_url = models.URLField(
        blank=True,
        null=True,
        help_text='YouTube or Vimeo URL'
    )
    
    # Content
    client_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True)
    description = models.TextField()
    service_type = models.CharField(
        max_length=100,
        blank=True,
        help_text='e.g., Wedding Photography, Cinematic Film'
    )
    
    # Details
    featured = models.BooleanField(
        default=False,
        help_text='Show on homepage'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft'
    )
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['-published_at', '-created_at']
        indexes = [
            models.Index(fields=['category', 'featured']),
            models.Index(fields=['status', '-published_at']),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if self.status == 'published' and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)

    @property
    def get_gallery_images(self):
        """Get all gallery images for this portfolio item"""
        return self.gallery_images.all()


class PortfolioGalleryImage(models.Model):
    """Individual gallery images for portfolio items"""
    portfolio_item = models.ForeignKey(
        PortfolioItem,
        on_delete=models.CASCADE,
        related_name='gallery_images'
    )
    image = models.ImageField(
        upload_to='portfolio/gallery/%Y/%m/'
    )
    caption = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"{self.portfolio_item.title} - {self.order}"


class PortfolioReview(models.Model):
    """Client reviews for portfolio items"""
    portfolio_item = models.ForeignKey(
        PortfolioItem,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    client_name = models.CharField(max_length=255)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.portfolio_item.title} - {self.client_name}"


class ServiceCategory(models.Model):
    """Main service categories"""
    CATEGORY_CHOICES = [
        ('photography', 'Photography'),
        ('videography', 'Videography'),
    ]
    
    name = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        unique=True
    )
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    icon = models.ImageField(
        upload_to='services/category_icons/',
        blank=True,
        null=True
    )
    image = models.ImageField(
        upload_to='services/category_images/',
        blank=True,
        null=True
    )
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Service Categories'
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Service(models.Model):
    """Individual services"""
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('coming_soon', 'Coming Soon'),
    ]
    
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    category = models.ForeignKey(
        ServiceCategory,
        on_delete=models.PROTECT,
        related_name='services'
    )
    description = models.TextField()
    short_description = models.CharField(max_length=255, blank=True)
    
    # Media
    hero_image = models.ImageField(
        upload_to='services/hero/'
    )
    icon = models.ImageField(
        upload_to='services/icons/',
        blank=True,
        null=True
    )
    
    # Details
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active'
    )
    featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'order', 'name']
        indexes = [
            models.Index(fields=['category', 'status']),
            models.Index(fields=['featured', 'status']),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
