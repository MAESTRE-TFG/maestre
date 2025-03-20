from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Tag
from .serializers import TagSerializer
from rest_framework.exceptions import ValidationError
from materials.serializers import DocumentSerializer
from materials.models import Document


class TagViewSet(viewsets.ModelViewSet):
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Tag.objects.filter(creator=self.request.user)

    def perform_create(self, serializer):
        try:
            serializer.save(creator=self.request.user)
        except Exception as e:
            raise ValidationError(str(e))

    @action(detail=False, methods=['get'], url_path='user_tags')
    def user_tags(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

        tags = Tag.objects.filter(creator=request.user)
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            tag = Tag.objects.get(id=pk, creator=request.user)
            tag.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Tag.DoesNotExist:
            return Response({'error': 'Tag not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='filtered_documents')
    def filtered_documents(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

        tag_names = request.query_params.getlist('tags')
        classroom_id = request.query_params.get('classroom_id')

        if not classroom_id:
            return Response({'error': 'classroom_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            classroom_id = int(classroom_id)
        except ValueError:
            return Response({'error': 'classroom_id must be a valid integer.'}, status=status.HTTP_400_BAD_REQUEST)

        if not tag_names:
            return Response({'error': 'Tags are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Get all tags that match the provided names and belong to the user
            tags = Tag.objects.filter(name__in=tag_names, creator=request.user)

            if not tags.exists():
                return Response([], status=status.HTTP_200_OK)

            # Get documents that belong to the classroom and have ALL the specified tags
            documents = Document.objects.filter(classroom_id=classroom_id)
            for tag in tags:
                documents = documents.filter(tags=tag)

            serializer = DocumentSerializer(documents.distinct(), many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def filtered_documents_user(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

        # Get tags from comma-separated string
        tags_string = request.query_params.get('tags', '')
        tag_names = [name.strip() for name in tags_string.split(',') if name.strip()]

        if not tag_names:
            return Response({'error': 'Tags are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Get all tags that match the provided names and belong to the user
            tags = Tag.objects.filter(name__in=tag_names, creator=request.user)

            # Get classrooms created by the user
            from classrooms.models import Classroom
            user_classrooms = Classroom.objects.filter(creator=request.user)

            # Get documents from those classrooms
            from materials.models import Document
            documents = Document.objects.filter(
                classroom_id__in=user_classrooms.values_list('id', flat=True)
            ).distinct()

            # Filter by tags
            for tag in tags:
                documents = documents.filter(tags=tag)

            if not documents.exists():
                return Response([], status=status.HTTP_200_OK)

            from materials.serializers import DocumentSerializer
            serializer = DocumentSerializer(documents, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)