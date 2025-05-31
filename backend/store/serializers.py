from rest_framework import serializers
from .models import Gear, Studio, Rental

class GearSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gear
        fields = '__all__'

class StudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Studio
        fields = '__all__'

class RentalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rental
        fields = '__all__'
