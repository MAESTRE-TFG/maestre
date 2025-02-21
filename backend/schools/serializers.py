from .models import School
from rest_framework import serializers
from users.models import CustomUser

class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ('id', 'name', 'community', 'city', 'stages')
    
    def create(self, validated_data):
        stages = validated_data.pop('stages')
        validated_data['stages'] = stages
        school = School.objects.create(**validated_data)
        return school
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.community = validated_data.get('community', instance.community)
        instance.city = validated_data.get('city', instance.city)
        instance.stages = validated_data.get('stages', instance.stages)
        instance.save()
        return instance