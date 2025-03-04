from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from .models import Student
from .serializers import StudentSerializer

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # Get classroom_id from request data
        # classroom_id = request.data.get('classroom_id')
        # if not classroom_id:
        #     return Response(
        #         {'error': 'classroom_id is required'}, 
        #         status=status.HTTP_400_BAD_REQUEST
        #     )

        # # Get the classroom or return 404 if not found
        # classroom = get_object_or_404(Classroom, id=classroom_id)
        
        # # Add classroom to the data before serialization
        # data = request.data.copy()
        # data['classroom'] = classroom.id
        
        # serializer = self.get_serializer(data=data)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)