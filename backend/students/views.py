from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from .models import Student
from.serializers import StudentSerializer

# Create your views here.
class StudentViewSet(viewsets.ModelViewSet):
    # Todas los conjuntos de vistas de Django Rest Framework requieren un queryset y un serializador
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    authentication_classes = [TokenAuthentication]

    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)