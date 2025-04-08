from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import ValidationError
from .models import Classroom
from .serializers import ClassroomSerializer


class ClassroomViewSet(viewsets.ModelViewSet):
    serializer_class = ClassroomSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Classroom.objects.all()
        return Classroom.objects.none()

    def check_object_permissions(self, request, obj):
        if request.method not in ['GET', 'HEAD', 'OPTIONS']:
            if request.user != obj.creator and not request.user.is_staff:
                self.permission_denied(
                    request,
                    message="You do not have permission to perform this action."
                )
        return super().check_object_permissions(request, obj)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()  # This will trigger permission checks
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
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                {"message": "Classroom created successfully!", "data": serializer.data},
                status=status.HTTP_201_CREATED,
                headers=headers
            )
        except ValidationError as e:
            return Response(
                {"error": "Validation error occurred.", "details": e.detail},
                status=status.HTTP_400_BAD_REQUEST
            )
