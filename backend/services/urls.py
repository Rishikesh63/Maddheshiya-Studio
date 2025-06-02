from django.urls import path
from . import views

urlpatterns = [
    path('services/', views.ServiceListView.as_view(), name='service-list'),
    path('services/<int:id>/', views.ServiceDetailView.as_view(), name='service-detail'),
    path('services/<int:service_id>/upload/', views.UploadMediaView.as_view(), name='upload-media'),
]

