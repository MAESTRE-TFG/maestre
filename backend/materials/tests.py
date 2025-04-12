from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from .serializers import DocumentSerializer
from rest_framework import status
from rest_framework.test import APITestCase, APIRequestFactory
from .models import Document
from classrooms.models import Classroom
from tags.models import Tag
from users.models import CustomUser
from rest_framework.authtoken.models import Token
from materials.views import DocumentViewSet
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

        self.tag1 = Tag.objects.create(name='Tag1', creator=self.user)
        self.tag2 = Tag.objects.create(name='Tag2', creator=self.user)

        self.test_file = SimpleUploadedFile(
            "test.pdf",
            b"file_content",
            content_type="application/pdf"
        )

        self.valid_data = {
            'name': 'TestDocument',
            'file': self.test_file,
            'classroom': self.classroom.id,
            'tag_ids': [self.tag1.id, self.tag2.id]
        }

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
        # Use the tags created in setUp to avoid duplication
        document = Document.objects.create(
            name='Tagged Document',
            file=self.test_file,
            classroom=self.classroom
        )
        document.tags.add(self.tag1, self.tag2)  # Add existing tags
        self.assertEqual(document.tags.count(), 2)

    def test_unauthorized_access(self):
        Document.objects.create(
            name='Test Document',
            file=self.test_file,
            classroom=self.classroom
        )

        self.client.credentials()

        response = self.client.get('/api/materials/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_all_user_materials(self):
        Document.objects.create(
            name='User Document',
            file=self.test_file,
            classroom=self.classroom
        )

        response = self.client.get('/api/materials/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

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
        factory = APIRequestFactory()
        request = factory.get('/api/materials/all_user_materials/')
        request.user = self.user

        view = DocumentViewSet()
        response = view.get_all_user_materials(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_filter_by_multiple_params(self):
        tag1 = Tag.objects.create(name='MultiFilterTag1', creator=self.user)
        tag2 = Tag.objects.create(name='MultiFilterTag2', creator=self.user)

        classroom2 = Classroom.objects.create(
            name='Second Classroom',
            academic_course='Another Course',
            description='Another Description',
            academic_year='2023-2024',
            creator=self.user
        )

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

        new_file = SimpleUploadedFile(
            "full_update.pdf",
            b"new_content",
            content_type="application/pdf"
        )

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
        self.assertEqual(len(response.data), 1)  # Should return all docs due to AND logic

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
        other_user = CustomUser.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='otherpassword'
        )

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

        document.refresh_from_db()
        self.assertIn('new_test', document.file.name)

    def test_update_tags_with_invalid_tag_ids(self):
        document = Document.objects.create(
            name='TestDocument',
            file=self.test_file,
            classroom=self.classroom
        )
        url = reverse('materials-detail', args=[document.id])
        data = {'tag_ids': [9999]}  # Use a non-existent tag ID
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('tag_ids', response.data)

    def tearDown(self):
        # Delete all documents and their associated files
        for document in Document.objects.all():
            if document.file and hasattr(document.file, 'path') and os.path.isfile(document.file.path):
                try:
                    os.remove(document.file.path)
                except (FileNotFoundError, PermissionError) as e:
                    print(f"Could not delete file {document.file.path}: {e}")
            document.delete()

        # Delete all tags
        Tag.objects.all().delete()

        # Delete all classrooms
        Classroom.objects.all().delete()

        # Clean up any remaining test files in the media directory
        media_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'media', 'documents')
        if os.path.exists(media_dir):
            for filename in os.listdir(media_dir):
                if 'test' in filename.lower() or 'update' in filename.lower():
                    try:
                        os.remove(os.path.join(media_dir, filename))
                    except (FileNotFoundError, PermissionError) as e:
                        print(f"Could not delete temporary file {filename}: {e}")

# ------------------------------------ Test serializers ----------------------------------

    def test_valid_serializer(self):
        serializer = DocumentSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid())

    def test_invalid_serializer_missing_name(self):
        invalid_data = self.valid_data.copy()
        invalid_data.pop('name')
        serializer = DocumentSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)

    def test_invalid_serializer_missing_file(self):
        invalid_data = self.valid_data.copy()
        invalid_data.pop('file')
        serializer = DocumentSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('file', serializer.errors)

    def test_invalid_serializer_invalid_tag_ids(self):
        invalid_data = self.valid_data.copy()
        invalid_data['tag_ids'] = ['invalid', 123]  # Invalid tag IDs
        serializer = DocumentSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('tag_ids', serializer.errors)

    def test_create_document_with_tags(self):
        serializer = DocumentSerializer(data=self.valid_data)
        serializer.is_valid(raise_exception=True)
        document = serializer.save()
        self.assertEqual(document.tags.count(), 2)
        self.assertEqual(document.tags.first().name, 'Tag1')

    def test_update_document_tags(self):
        document = Document.objects.create(
            name='TestDocument',
            file=SimpleUploadedFile("test.pdf", b"file_content", content_type="application/pdf"),
            classroom=self.classroom
        )
        data = {'tag_ids': [self.tag1.id]}
        serializer = DocumentSerializer(instance=document, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated_document = serializer.save()
        self.assertEqual(updated_document.tags.count(), 1)
        self.assertEqual(updated_document.tags.first().name, 'Tag1')


class DocumentViewSetAdditionalTests(APITestCase):
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
        self.tag1 = Tag.objects.create(name='Tag1', creator=self.user)
        self.tag2 = Tag.objects.create(name='Tag2', creator=self.user)
        self.test_file = SimpleUploadedFile("test.pdf", b"file_content", content_type="application/pdf")

    def test_filter_documents_by_nonexistent_classroom(self):
        response = self.client.get(f"{reverse('materials-list')}?classroom_id=9999")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_filter_documents_by_nonexistent_tag(self):
        response = self.client.get(f"{reverse('materials-list')}?tag_names=NonexistentTag")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_create_document_with_invalid_file_extension(self):
        invalid_file = SimpleUploadedFile("test.txt", b"invalid_content", content_type="text/plain")
        data = {
            'name': 'Invalid File',
            'file': invalid_file,
            'classroom': self.classroom.id
        }
        response = self.client.post(reverse('materials-list'), data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('file', response.data)

    def test_update_tags_with_invalid_tag_ids(self):
        document = Document.objects.create(
            name='TestDocument',
            file=self.test_file,
            classroom=self.classroom
        )
        url = reverse('materials-detail', args=[document.id])
        data = {'tag_ids': ['invalid']}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('tag_ids', response.data)

    def test_get_queryset_with_no_documents(self):
        response = self.client.get(reverse('materials-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_create_document_without_tags(self):
        data = {
            'name': 'Document Without Tags',
            'file': self.test_file,
            'classroom': self.classroom.id
        }
        response = self.client.post(reverse('materials-list'), data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        document = Document.objects.get(name='Document Without Tags')
        self.assertEqual(document.tags.count(), 0)

    def tearDown(self):
        # Delete all documents and their associated files
        for document in Document.objects.all():
            if document.file and hasattr(document.file, 'path') and os.path.isfile(document.file.path):
                try:
                    os.remove(document.file.path)
                except (FileNotFoundError, PermissionError) as e:
                    print(f"Could not delete file {document.file.path}: {e}")
            document.delete()

        # Delete all tags
        Tag.objects.all().delete()

        # Delete all classrooms
        Classroom.objects.all().delete()

        # Clean up any remaining test files in the media directory
        media_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'media', 'documents')
        if os.path.exists(media_dir):
            for filename in os.listdir(media_dir):
                if 'test' in filename.lower() or 'update' in filename.lower():
                    try:
                        os.remove(os.path.join(media_dir, filename))
                    except (FileNotFoundError, PermissionError) as e:
                        print(f"Could not delete temporary file {filename}: {e}")
