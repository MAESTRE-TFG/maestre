from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Document
from classrooms.models import Classroom
from tags.models import Tag
from users.models import CustomUser
from rest_framework.authtoken.models import Token
import os


class DocumentTests(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword'
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")

        self.classroom = Classroom.objects.create(
            name='TestClassroom',
            academic_course='Test Course',
            description='Test Description',
            academic_year='2023-2024',
            creator=self.user
        )

        self.test_file = SimpleUploadedFile(
            "test.pdf",
            b"file_content",
            content_type="application/pdf"
        )

    def test_document_model_str(self):
        """Test the string representation of Document model"""
        document = Document.objects.create(
            name='Test Document',
            file=self.test_file,
            classroom=self.classroom
        )
        self.assertEqual(str(document), 'Test Document')

    def test_document_file_validation(self):
        """Test file extension validation"""
        invalid_file = SimpleUploadedFile(
            "test.txt",
            b"invalid_content",
            content_type="text/plain"
        )
        data = {
            'name': 'Invalid Document',
            'file': invalid_file,
            'classroom': self.classroom.id
        }
        response = self.client.post(reverse('materials-list'), data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_document_limit_per_classroom(self):
        # Create 5 documents
        for i in range(5):
            Document.objects.create(
                name=f'Document {i}',
                file=self.test_file,
                classroom=self.classroom
            )

        # Try to create a 6th document
        data = {
            'name': 'Sixth Document',
            'file': self.test_file,
            'classroom': self.classroom.id
        }
        response = self.client.post(reverse('materials-list'), data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_document_deletion(self):
        document = Document.objects.create(
            name='Delete Test',
            file=self.test_file,
            classroom=self.classroom
        )
        file_path = document.file.path
        self.assertTrue(os.path.exists(file_path))
        document.delete()
        self.assertFalse(os.path.exists(file_path))

    def test_document_update(self):
        document = Document.objects.create(
            name='Original Name',
            file=self.test_file,
            classroom=self.classroom
        )
        data = {'name': 'Updated Name'}
        response = self.client.patch(
            reverse('materials-detail', args=[document.id]),
            data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        document.refresh_from_db()
        self.assertEqual(document.name, 'Updated Name')

    def test_document_list_filtering(self):
        Document.objects.create(
            name='Test Document',
            file=self.test_file,
            classroom=self.classroom
        )
        response = self.client.get(
            f"{reverse('materials-list')}?classroom_id={self.classroom.id}"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_document_tags(self):
        tag1 = Tag.objects.create(name='Tag1', creator=self.user)
        tag2 = Tag.objects.create(name='Tag2', creator=self.user)
        document = Document.objects.create(
            name='Tagged Document',
            file=self.test_file,
            classroom=self.classroom
        )
        document.tags.add(tag1, tag2)
        self.assertEqual(document.tags.count(), 2)

    def test_unauthorized_access(self):
        # Create a document first
        document = Document.objects.create(
            name='Test Document',
            file=self.test_file,
            classroom=self.classroom
        )

        # Remove authentication
        self.client.credentials()

        # Use a direct URL instead of reverse to avoid the AnonymousUser issue
        response = self.client.get('/api/materials/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_all_user_materials(self):
        # Create a document for the authenticated user
        document = Document.objects.create(
            name='User Document',
            file=self.test_file,
            classroom=self.classroom
        )

        # Try with a different URL path that might match your configuration
        response = self.client.get('/api/materials/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test the response content
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'User Document')

    def tearDown(self):
        for document in Document.objects.all():
            if document.file and os.path.isfile(document.file.path):
                os.remove(document.file.path)
