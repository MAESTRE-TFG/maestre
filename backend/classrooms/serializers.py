from .models import Classroom
from rest_framework import serializers
import re


class ClassroomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classroom
        fields = ['id', 'name', 'academic_course', 'description', 'academic_year', 'creator']
        read_only_fields = ['creator']
    
    def validate_academic_year(self, value):
        # Check format AAAA-AAAA
        if not re.match(r'^\d{4}-\d{4}$', value):
            raise serializers.ValidationError("Academic year must be in format YYYY-YYYY")
        
        # Extract years
        first_year, second_year = map(int, value.split('-'))
        
        # First year should not be after second year
        if first_year > second_year:
            raise serializers.ValidationError("First year cannot be after second year")
        
        # Both years cannot be the same
        if first_year == second_year:
            raise serializers.ValidationError("Both years cannot be the same")
        
        # Gap cannot be more than one year
        if second_year - first_year > 1:
            raise serializers.ValidationError("Gap between years cannot be more than one year")
        
        return value

    def create(self, validated_data):
        classroom = Classroom.objects.create(**validated_data)
        return classroom

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.academic_course = validated_data.get('academic_course', instance.academic_course)
        instance.description = validated_data.get('description', instance.description)
        instance.academic_year = validated_data.get('academic_year', instance.academic_year)
        instance.save()
        return instance
