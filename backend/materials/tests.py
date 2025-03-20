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
        document = Document.objects.create(
            name='Test Document',
            file=self.test_file,
            classroom=self.classroom
        )
        self.assertEqual(str(document), 'Test Document')

    def test_document_file_validation(self):
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

    def test_create_document_without_classroom(self):
        data = {
            'name': 'No Classroom Document',
            'file': self.test_file
            # No classroom specified
        }

        response = self.client.post(reverse('materials-list'), data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_document_with_invalid_file_type(self):
        invalid_file = SimpleUploadedFile(
            "test.exe",
            b"invalid_content",
            content_type="application/octet-stream"
        )

        data = {
            'name': 'Invalid File Type',
            'file': invalid_file,
            'classroom': self.classroom.id
        }

        response = self.client.post(reverse('materials-list'), data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_all_user_materials_method(self):
        # Create documents
        Document.objects.create(
            name='User Materials Test 1',
            file=self.test_file,
            classroom=self.classroom
        )
        Document.objects.create(
            name='User Materials Test 2',
            file=self.test_file,
            classroom=self.classroom
        )

        # Create a mock request
        from rest_framework.test import APIRequestFactory
        factory = APIRequestFactory()
        request = factory.get('/api/materials/all_user_materials/')
        request.user = self.user

        # Call the method directly
        from materials.views import DocumentViewSet
        view = DocumentViewSet()
        response = view.get_all_user_materials(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_filter_by_multiple_params(self):
        # Create tags
        tag1 = Tag.objects.create(name='MultiFilterTag1', creator=self.user)
        tag2 = Tag.objects.create(name='MultiFilterTag2', creator=self.user)

        # Create another classroom
        classroom2 = Classroom.objects.create(
            name='Second Classroom',
            academic_course='Another Course',
            description='Another Description',
            academic_year='2023-2024',
            creator=self.user
        )

        # Create documents with different tags and classrooms
        doc1 = Document.objects.create(
            name='Multi Filter Doc 1',
            file=self.test_file,
            classroom=self.classroom
        )
        doc1.tags.add(tag1)

        doc2 = Document.objects.create(
            name='Multi Filter Doc 2',
            file=self.test_file,
            classroom=classroom2
        )
        doc2.tags.add(tag1, tag2)

        # Filter by both classroom and tag
        response = self.client.get(
            f"{reverse('materials-list')}?classroom_id={classroom2.id}&tag_names={tag1.name}"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Multi Filter Doc 2')

    def test_partial_update_document(self):
        document = Document.objects.create(
            name='Original Partial Update',
            file=self.test_file,
            classroom=self.classroom
        )

        # Store the original file name for comparison
        original_file_name = document.file.name

        # Update only the name
        data = {
            'name': 'Updated Partial Name'
        }

        response = self.client.patch(
            reverse('materials-detail', args=[document.id]),
            data,
            format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        document.refresh_from_db()
        self.assertEqual(document.name, 'Updated Partial Name')

        # Verify the file wasn't changed by comparing file names
        self.assertEqual(document.file.name, original_file_name)

    def test_full_update_document(self):
        document = Document.objects.create(
            name='Original Full Update',
            file=self.test_file,
            classroom=self.classroom
        )

        # Create a new file for the update
        new_file = SimpleUploadedFile(
            "full_update.pdf",
            b"new_content",
            content_type="application/pdf"
        )

        # Full update with all fields
        data = {
            'name': 'Fully Updated Document',
            'file': new_file,
            'classroom': self.classroom.id
        }

        response = self.client.put(
            reverse('materials-detail', args=[document.id]),
            data,
            format='multipart'
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        document.refresh_from_db()
        self.assertEqual(document.name, 'Fully Updated Document')
        self.assertIn('full_update', document.file.name)

    def test_create_document_with_classroom_permission(self):
        other_user = CustomUser.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='otherpassword'
        )

        # Create a classroom for the other user
        other_classroom = Classroom.objects.create(
            name='Other Classroom',
            academic_course='Other Course',
            description='Other Description',
            academic_year='2023-2024',
            creator=other_user
        )

        # Try to create a document in the other user's classroom
        data = {
            'name': 'Unauthorized Classroom Document',
            'file': self.test_file,
            'classroom': other_classroom.id
        }

        response = self.client.post(reverse('materials-list'), data, format='multipart')

        # This should fail because the current user doesn't own the classroom
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_document_serializer_validation(self):
        # Test with missing required fields
        data = {
            # Missing name and file
            'classroom': self.classroom.id
        }

        response = self.client.post(reverse('materials-list'), data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)
        self.assertIn('file', response.data)

    def test_filter_documents_by_tags(self):
        tag1 = Tag.objects.create(name='FilterTag1', creator=self.user)
        tag2 = Tag.objects.create(name='FilterTag2', creator=self.user)

        doc1 = Document.objects.create(
            name='Doc with Tag1',
            file=self.test_file,
            classroom=self.classroom
        )
        doc1.tags.add(tag1)

        doc2 = Document.objects.create(
            name='Doc with Tag2',
            file=self.test_file,
            classroom=self.classroom
        )
        doc2.tags.add(tag2)

        doc3 = Document.objects.create(
            name='Doc with both tags',
            file=self.test_file,
            classroom=self.classroom
        )
        doc3.tags.add(tag1, tag2)

        # Filter by tag1
        response = self.client.get(
            f"{reverse('materials-list')}?tag_names={tag1.name}"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Should return doc1 and doc3

        # Filter by both tags
        response = self.client.get(
            f"{reverse('materials-list')}?tag_names={tag1.name},{tag2.name}"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)  # Should return all docs due to OR logic

    def test_document_serializer_fields(self):
        tag = Tag.objects.create(name='SerializerTag', creator=self.user)

        document = Document.objects.create(
            name='Serializer Test',
            file=self.test_file,
            classroom=self.classroom
        )
        document.tags.add(tag)

        response = self.client.get(
            reverse('materials-detail', args=[document.id])
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check all expected fields are in the response
        expected_fields = ['id', 'name', 'file', 'classroom', 'tags']
        for field in expected_fields:
            self.assertIn(field, response.data)

        # Check that tags are properly serialized
        self.assertEqual(len(response.data['tags']), 1)
        self.assertEqual(response.data['tags'][0]['name'], 'SerializerTag')

    def test_document_create_with_invalid_classroom(self):
        data = {
            'name': 'Invalid Classroom Document',
            'file': self.test_file,
            'classroom': 9999  # Non-existent classroom ID
        }

        response = self.client.post(reverse('materials-list'), data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_document_access_other_user(self):
        # Create another user
        other_user = CustomUser.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='otherpassword'
        )

        # Create a classroom for the other user
        other_classroom = Classroom.objects.create(
            name='Other Classroom',
            academic_course='Other Course',
            description='Other Description',
            academic_year='2023-2024',
            creator=other_user
        )

        # Create a document in the other user's classroom
        other_document = Document.objects.create(
            name='Other User Document',
            file=self.test_file,
            classroom=other_classroom
        )

        # Try to access the document
        response = self.client.get(
            reverse('materials-detail', args=[other_document.id])
        )

        # Should not be able to access
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_document_clean_method(self):
        # Create 5 documents to reach the limit
        for i in range(5):
            Document.objects.create(
                name=f'Clean Test Document {i}',
                file=self.test_file,
                classroom=self.classroom
            )

        # Try to create a 6th document directly with the model
        from django.core.exceptions import ValidationError

        with self.assertRaises(ValidationError):
            document = Document(
                name='Sixth Document',
                file=self.test_file,
                classroom=self.classroom
            )
            document.clean()  # This should raise ValidationError

    def test_document_update_with_new_file(self):
        document = Document.objects.create(
            name='File Update Test',
            file=self.test_file,
            classroom=self.classroom
        )

        # Create a new file
        new_file = SimpleUploadedFile(
            "new_test.pdf",
            b"new_file_content",
            content_type="application/pdf"
        )

        data = {
            'file': new_file
        }

        response = self.client.patch(
            reverse('materials-detail', args=[document.id]),
            data,
            format='multipart'
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check if the file was updated
        document.refresh_from_db()
        self.assertIn('new_test', document.file.name)

    def tearDown(self):
        # Clean up all document files
        for document in Document.objects.all():
            if document.file and hasattr(document.file, 'path') and os.path.isfile(document.file.path):
                try:
                    os.remove(document.file.path)
                except (FileNotFoundError, PermissionError) as e:
                    print(f"Could not delete file {document.file.path}: {e}")

        # Delete all documents
        Document.objects.all().delete()

        # Delete all tags created for tests
        Tag.objects.all().delete()

        # Delete all classrooms except the main test classroom
        Classroom.objects.exclude(id=self.classroom.id).delete()

        # Clean up any temporary files that might have been created
        media_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'media', 'documents')
        if os.path.exists(media_dir):
            for filename in os.listdir(media_dir):
                if 'test' in filename.lower() or 'update' in filename.lower():
                    try:
                        os.remove(os.path.join(media_dir, filename))
                    except (FileNotFoundError, PermissionError) as e:
                        print(f"Could not delete temporary file {filename}: {e}")
