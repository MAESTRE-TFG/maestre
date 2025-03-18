from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from classrooms.models import Classroom
from .models import Document
from .serializers import DocumentSerializer
from rest_framework.decorators import permission_classes


class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        classroom_id = self.request.query_params.get('classroom_id')
        if classroom_id:
            return Document.objects.filter(classroom_id=classroom_id)
        return Document.objects.filter(classroom__creator=self.request.user)

    def create(self, request, *args, **kwargs):
        classroom_id = request.data.get('classroom')
        if classroom_id:
            classroom = Classroom.objects.get(id=classroom_id)
            if classroom.documents.count() >= 5:
                return Response(
                    {"error": "This classroom already has the maximum number of files (5)."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return super().create(request, *args, **kwargs)

    def update_tags(self, request, pk=None):
        document = self.get_object()
        tag_ids = request.data.get('tag_ids', [])

        try:
            document.tags.set(tag_ids)
            serializer = self.get_serializer(document)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


@permission_classes([IsAuthenticated])
def get_all_user_materials(request):
    materials = Document.objects.filter(
        classroom__members=request.user
    ).select_related('classroom').prefetch_related('tags')
    serializer = DocumentSerializer(materials, many=True)
    return Response(serializer.data)
