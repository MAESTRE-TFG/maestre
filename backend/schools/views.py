from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import School
from .serializers import SchoolSerializer
from users.models import CustomUser


class SchoolViewSet(viewsets.ModelViewSet):
    serializer_class = SchoolSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = School.objects.all()
        city = self.request.query_params.get('city')
        if city:
            queryset = queryset.filter(city=city)
        return queryset

    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        # Validate name length
        if len(data.get("name", "")) > 50:
            return Response({"detail": "Name cannot exceed 50 characters."}, status=status.HTTP_400_BAD_REQUEST)
        # Validate city is not null
        if not data.get("city"):
            return Response({"detail": "City is required."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)  # Ensure only valid fields are processed
        school = serializer.save()
        try:
            user = CustomUser.objects.get(id=request.user.id)
            user.school = school
            user.save()
        except CustomUser.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        data = request.data.copy()

        # Validate name length
        if len(data.get("name", "")) > 100:
            return Response({"detail": "Name cannot exceed 100 characters."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate city is not null
        if not data.get("city"):
            return Response({"detail": "City is required."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)  # Ensure only valid fields are processed
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
        except School.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        if not request.user.is_staff:
            return Response({"detail": "You do not have permission to perform this action."},
                            status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class SchoolListView(generics.ListCreateAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
