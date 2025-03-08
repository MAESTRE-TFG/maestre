from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import Classroom
from .serializers import ClassroomSerializer


class ClassroomViewSet(viewsets.ModelViewSet):
    serializer_class = ClassroomSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        creator_id = self.request.query_params.get('creator')
        if creator_id:
            try:
                # Convert to integer to ensure it's a valid ID
                creator_id = int(creator_id)
                return Classroom.objects.filter(creator_id=creator_id)
            except (ValueError, TypeError):
                # Handle case where creator_id is not a valid integer
                return Classroom.objects.none()
        return Classroom.objects.all()

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save(creator=request.user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        if request.user != instance.creator and not request.user.is_staff:
            return Response({"detail": "You do not have permission to perform this action."},
                            status=status.HTTP_403_FORBIDDEN)
        data = request.data.copy()
        serializer = self.get_serializer(instance, data=data, partial=partial)
        if not serializer.is_valid():
            print(serializer.errors)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.user != instance.creator and not request.user.is_staff:
            return Response({"detail": "You do not have permission to perform this action."},
                            status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)
