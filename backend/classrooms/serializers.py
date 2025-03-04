from .models import Classroom
from rest_framework import serializers


class ClassroomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classroom
        fields = ('id', 'name', 'academic_course', 'description', 'academic_year', 'number_of_students')
        read_only_fields = ('creator',)

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
