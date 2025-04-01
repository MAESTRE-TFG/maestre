from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import ValidationError
from .models import Student
from .serializers import StudentSerializer
from classrooms.models import Classroom


class StudentViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        classroom_id = self.request.query_params.get('classroom_id')
        if (classroom_id):
            if not classroom_id.isdigit():
                raise ValidationError({'error': 'classroom_id must be a valid integer'})
            return Student.objects.filter(classroom_id=classroom_id)
        return Student.objects.all()
    serializer_class = StudentSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        classroom_id = request.data.get('classroom_id')
        if not classroom_id:
            return Response(
                {'error': 'classroom_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        classroom = get_object_or_404(Classroom, id=classroom_id)

        data = request.data.copy()
        data['classroom'] = classroom.id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
