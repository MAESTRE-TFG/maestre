from rest_framework import filters, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Terms
from .serializers import TermsSerializer


class IsAdmin(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.is_staff


class TermsViewSet(viewsets.ModelViewSet):
    queryset = Terms.objects.all().order_by('-updated_at')
    serializer_class = TermsSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['tag']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdmin]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = super().get_queryset()
        tag = self.request.query_params.get('tag', None)
        if tag:
            queryset = queryset.filter(tag=tag)
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        serializer.save()
