from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action, permission_classes
from classrooms.models import Classroom
from .models import Document
from .serializers import DocumentSerializer
import pdfplumber
# Add this import for DOCX processing
import docx
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import tempfile
import os
from .models import Document


class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Document.objects.filter(classroom__creator=self.request.user)

        # Filter by classroom if provided
        classroom_id = self.request.query_params.get('classroom_id')
        if classroom_id:
            queryset = queryset.filter(classroom_id=classroom_id)

        # Filter by tag names if provided
        tag_names = self.request.query_params.get('tag_names')
        if tag_names:
            # Split the comma-separated tag names
            tag_names_list = tag_names.split(',')
            # Filter documents that have any of these tags
            queryset = queryset.filter(tags__name__in=tag_names_list).distinct()

        return queryset

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

    @action(detail=False, methods=['get'], url_path='user_materials')
    def get_all_user_materials(self, request):
        materials = Document.objects.filter(
            classroom__creator=request.user
        ).select_related('classroom').prefetch_related('tags')
        serializer = self.get_serializer(materials, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], url_path='extract-text')
    def extract_text_from_uploaded_file(self, request):
        """Extract text from an uploaded DOCX file"""
        if 'file' not in request.FILES:
            return Response({'error': 'No file uploaded'}, status=400)
        
        file = request.FILES['file']
        
        # Check if it's a DOCX
        if not file.name.lower().endswith('.docx'):
            return Response({'error': 'Only DOCX files are supported'}, status=400)
        
        try:
            # Create a temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as temp_file:
                for chunk in file.chunks():
                    temp_file.write(chunk)
                temp_file_path = temp_file.name
            
            # Extract text using python-docx
            doc = docx.Document(temp_file_path)
            text = ""
            
            # Extract text from paragraphs
            for para in doc.paragraphs:
                if para.text:
                    text += para.text + "\n"
            
            # Extract text from tables
            for table in doc.tables:
                for row in table.rows:
                    for cell in row.cells:
                        text += cell.text + " "
                    text += "\n"
                text += "\n"
            
            # Clean up the temporary file
            os.unlink(temp_file_path)
            
            return Response({'text': text})
        
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    @action(detail=True, methods=['get'], url_path='extract-text')
    def extract_text_from_material(self, request, pk=None):
        """Extract text from a material that's already in the database"""
        try:
            # Get the material
            material = self.get_object()
            
            # Check if it's a DOCX
            if not material.file.name.lower().endswith('.docx'):
                return Response({'error': 'Only DOCX files are supported'}, status=400)
            
            # Extract text using python-docx
            doc = docx.Document(material.file.path)
            text = ""
            
            # Extract text from paragraphs
            for para in doc.paragraphs:
                if para.text:
                    text += para.text + "\n"
            
            # Extract text from tables
            for table in doc.tables:
                for row in table.rows:
                    for cell in row.cells:
                        text += cell.text + " "
                    text += "\n"
                text += "\n"
            
            return Response({'text': text})
        
        except Exception as e:
            return Response({'error': str(e)}, status=500)
