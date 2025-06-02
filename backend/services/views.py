from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponse
from .models import Service, UploadedMedia
from .serializers import ServiceSerializer, UploadedMediaSerializer

def home(request):
    return HttpResponse('Welcome to Maddheshiya Studio')

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
        try:
            service = Service.objects.get(id=service_id)
        except Service.DoesNotExist:
            return Response({'error': 'Service not found.'}, status=404)

        uploaded_media = []

        media_type = request.data.get('media_type')
        files = request.FILES.getlist('file')
        external_url = request.data.get('external_url')

        if media_type in ['image', 'video'] and files:
            for file in files:
                media = UploadedMedia.objects.create(
                    service=service,
                    uploaded_by=request.user,
                    media_type=media_type,
                    file=file
                )
                uploaded_media.append(media)

        elif media_type == 'url' and external_url:
            media = UploadedMedia.objects.create(
                service=service,
                uploaded_by=request.user,
                media_type='url',
                external_url=external_url
            )
            uploaded_media.append(media)

        else:
            return Response({
                'error': 'Invalid input. Provide media_type as "image", "video", or "url". '
                         'For image/video, attach file(s). For url, provide external_url.'
            }, status=400)

        return Response(UploadedMediaSerializer(uploaded_media, many=True).data)
