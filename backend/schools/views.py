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
        serializer = self.get_serializer(data=data)
        if not serializer.is_valid():
            print(serializer.errors)
        serializer.is_valid(raise_exception=True)
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
        serializer = self.get_serializer(instance, data=data, partial=partial)
        if not serializer.is_valid():
            print(serializer.errors)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response({"detail": "You do not have permission to perform this action."},
                            status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)


class SchoolListView(generics.ListCreateAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
