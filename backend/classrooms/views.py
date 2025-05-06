from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import ValidationError
from .models import Classroom
from .serializers import ClassroomSerializer
from django.conf import settings


class ClassroomViewSet(viewsets.ModelViewSet):
    serializer_class = ClassroomSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            # Filter classrooms to only show those created by the current user
            return Classroom.objects.filter(creator=user)
        return Classroom.objects.none()

    def check_object_permissions(self, request, obj):
        if request.method not in ['GET', 'HEAD', 'OPTIONS']:
            if request.user != obj.creator and not request.user.is_staff:
                self.permission_denied(
                    request,
                    message="You do not have permission to perform this action."
                )
        return super().check_object_permissions(request, obj)

    def get_object(self):
        # Retrieve the object without filtering by the current user
        obj = get_object_or_404(Classroom, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        partial = kwargs.pop('partial', True)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(
                {"message": "Classroom updated successfully!", "data": serializer.data},
                status=status.HTTP_200_OK
            )
        except ValidationError as e:
            return Response(
                {"error": "Validation error occurred.", "details": e.detail},
                status=status.HTTP_400_BAD_REQUEST
            )

    def destroy(self, request, *args, **kwargs):
        self.get_object()  # This will trigger permission checks
        return super().destroy(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    def create(self, request, *args, **kwargs):
        try:
            if request.user.classrooms.count() >= settings.MAX_CLASSROOMS_PER_TEACHER:
                return Response(
                    {"error": f'You cannot create more than {settings.MAX_CLASSROOMS_PER_TEACHER} classrooms.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            serializer = self.get_serializer(data=request.data)
            self.perform_create(serializer)
            return Response(
                {"message": "Classroom created successfully!", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )
        except ValidationError as e:
            return Response(
                {"error": "Validation error occurred.", "details": e.detail},
                status=status.HTTP_400_BAD_REQUEST
            )
