"""
URL configuration for maddheshiyaStudio project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from services.views import home

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',home, name='home'),  # Home view for the application
    # App routes
    path('api/users/', include('users.urls')),
    path('api/services/', include('services.urls')),
    path('api/store/', include('store.urls')),

      # JWT auth routes
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # dj-rest-auth URLs:
    path('auth/', include('dj_rest_auth.urls')),            # Login, logout, password reset etc.
    path('auth/registration/', include('dj_rest_auth.registration.urls')),  # Registration + email verification
]

# Media files handling (e.g. profile images, uploads)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)