from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Document
from .serializers import DocumentSerializer

# Create your views here.
class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        classroom_id = self.request.query_params.get('classroom_id')
        if classroom_id:
            return Document.objects.filter(classroom_id=classroom_id)
        return Document.objects.all()

    # In your MaterialViewSet or relevant view
    def create(self, request, *args, **kwargs):
        classroom_id = request.data.get('classroom_id')
        if classroom_id:
            classroom = Classroom.objects.get(id=classroom_id)
            if classroom.documents.count() >= 50:
                return Response(
                    {"error": "This classroom already has the maximum number of files (50)."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return super().create(request, *args, **kwargs)