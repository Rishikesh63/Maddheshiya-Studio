from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Service, UploadedMedia
from .serializers import ServiceSerializer, UploadedMediaSerializer
from django.http import HttpResponse

def home(request):
    return HttpResponse('Welocome to Maddheshiya Studio')

class ServiceListView(generics.ListAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

class ServiceDetailView(generics.RetrieveAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    lookup_field = 'id'

class UploadMediaView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request, service_id):
        service = Service.objects.get(id=service_id)
        images = request.FILES.getlist('images')

        uploaded = []
        for image in images:
            media = UploadedMedia.objects.create(service=service, uploaded_by=request.user, image=image)
            uploaded.append(media)

        return Response(UploadedMediaSerializer(uploaded, many=True).data)
