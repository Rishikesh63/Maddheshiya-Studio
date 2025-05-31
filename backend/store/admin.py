from django.contrib import admin

# Register your models here.
from .models import Gear, Studio, Rental

admin.site.register(Gear)
admin.site.register(Studio)
admin.site.register(Rental)
