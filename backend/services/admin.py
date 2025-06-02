from django.contrib import admin

# Register your models here.
from .models import Service,UploadedMedia

admin.site.register(Service)
admin.site.register(UploadedMedia)
