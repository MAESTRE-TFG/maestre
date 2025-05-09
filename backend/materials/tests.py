from django.core.exceptions import ValidationError
from django.test import TestCase
from classrooms.models import Classroom
from materials.models import Document
from tags.models import Tag
from django.core.files.uploadedfile import SimpleUploadedFile
from django.conf import settings
from django.contrib.auth import get_user_model
import os
from materials.serializers import DocumentSerializer
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

User = get_user_model()


class DocumentModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password"
        )
        self.classroom = Classroom.objects.create(
            name="Test Classroom",
            creator=self.user
        )
        self.test_file = SimpleUploadedFile(
            "test.pdf", b"file_content", content_type="application/pdf"
        )
        self.document = Document.objects.create(
            name="Test Document",
            file=self.test_file,
            classroom=self.classroom
        )

    def test_document_creation(self):
        self.assertEqual(self.document.name, "Test Document")
        self.assertEqual(self.document.classroom, self.classroom)
        self.assertTrue(os.path.isfile(self.document.file.path))

    def test_document_string_representation(self):
        self.assertEqual(str(self.document), "Test Document")

    def test_document_file_extension_validation(self):
        invalid_file = SimpleUploadedFile(
            "test.exe", b"file_content", content_type="application/octet-stream"
        )
        document = Document(name="Invalid File", file=invalid_file, classroom=self.classroom)
        with self.assertRaises(ValidationError) as context:
            document.full_clean()
        self.assertIn("File extension “exe” is not allowed.", str(context.exception))

    def test_document_file_limit_validation(self):
        # Simulate reaching the maximum number of files in the classroom
        with self.settings(MAX_FILES_PER_CLASSROOM=1):
            with self.assertRaises(ValidationError) as context:
                Document.objects.create(
                    name="Exceeding Document",
                    file=self.test_file,
                    classroom=self.classroom
                )
            self.assertIn(
                f"A classroom cannot have more than {settings.MAX_FILES_PER_CLASSROOM} files.",
                str(context.exception)
            )

    def test_document_delete_removes_file(self):
        file_path = self.document.file.path
        self.document.delete()
        self.assertFalse(os.path.isfile(file_path))

    def test_document_tags_relationship(self):
        tag1 = Tag.objects.create(name="Tag 1", creator=self.user)
        tag2 = Tag.objects.create(name="Tag 2", creator=self.user)
        self.document.tags.add(tag1, tag2)
        self.assertEqual(self.document.tags.count(), 2)
        self.assertIn(tag1, self.document.tags.all())
        self.assertIn(tag2, self.document.tags.all())


class DocumentSerializerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password"
        )
        self.classroom = Classroom.objects.create(
            name="Test Classroom",
            creator=self.user
        )
        self.tag1 = Tag.objects.create(name="Tag 1", creator=self.user)
        self.tag2 = Tag.objects.create(name="Tag 2", creator=self.user)
        self.test_file = SimpleUploadedFile(
            "test.pdf", b"file_content", content_type="application/pdf"
        )
        self.document = Document.objects.create(
            name="Test Document",
            file=self.test_file,
            classroom=self.classroom
        )

    def test_validate_tag_ids_must_be_list(self):
        serializer = DocumentSerializer()
        with self.assertRaises(DRFValidationError) as context:
            serializer.validate_tag_ids("not_a_list")
        self.assertIn("tag_ids must be a list.", str(context.exception))

    def test_validate_tag_ids_must_be_integers(self):
        serializer = DocumentSerializer()
        with self.assertRaises(DRFValidationError) as context:
            serializer.validate_tag_ids(["not_an_integer"])
        self.assertIn("Invalid tag ID: not_an_integer. Must be an integer.", str(context.exception))

    def test_validate_tag_ids_must_exist(self):
        serializer = DocumentSerializer()
        with self.assertRaises(DRFValidationError) as context:
            serializer.validate_tag_ids([9999])  # Non-existent tag ID
        self.assertIn("Tag with ID 9999 does not exist.", str(context.exception))

    def test_create_document_with_tags(self):
        data = {
            "name": "New Document",
            "file": self.test_file,
            "classroom": self.classroom.id,
            "tag_ids": [self.tag1.id, self.tag2.id]
        }
        serializer = DocumentSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        document = serializer.save()
        self.assertEqual(document.name, "New Document")
        self.assertEqual(document.classroom, self.classroom)
        self.assertEqual(document.tags.count(), 2)
        self.assertIn(self.tag1, document.tags.all())
        self.assertIn(self.tag2, document.tags.all())

    def test_update_document_tags(self):
        data = {
            "tag_ids": [self.tag1.id]
        }
        serializer = DocumentSerializer(instance=self.document, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        document = serializer.save()
        self.assertEqual(document.tags.count(), 1)
        self.assertIn(self.tag1, document.tags.all())
        self.assertNotIn(self.tag2, document.tags.all())

    def test_update_document_fields(self):
        data = {
            "name": "Updated Document"
        }
        serializer = DocumentSerializer(instance=self.document, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        document = serializer.save()
        self.assertEqual(document.name, "Updated Document")


class DocumentViewSetTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password"
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        self.classroom = Classroom.objects.create(
            name="Test Classroom",
            creator=self.user
        )
        self.tag1 = Tag.objects.create(name="Tag 1", creator=self.user)
        self.tag2 = Tag.objects.create(name="Tag 2", creator=self.user)
        self.test_file = SimpleUploadedFile(
            "test.pdf", b"file_content", content_type="application/pdf"
        )
        self.document = Document.objects.create(
            name="Test Document",
            file=self.test_file,
            classroom=self.classroom
        )

    def test_get_queryset_filters_by_classroom_id(self):
        response = self.client.get(f"/api/materials/?classroom_id={self.classroom.id}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_queryset_filters_by_tag_names(self):
        self.document.tags.add(self.tag1)
        response = self.client.get(f"/api/materials/?tag_names={self.tag1.name}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    # def test_create_document_valid(self):
    #     data = {
    #         "name": "New Document",
    #         "file": self.test_file,
    #         "classroom": self.classroom.id
    #     }
    #     response = self.client.post("/api/materials/", data, format="multipart")
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_document_invalid_classroom(self):
        data = {
            "name": "New Document",
            "file": self.test_file,
            "classroom": 9999  # Non-existent classroom ID
        }
        response = self.client.post("/api/materials/", data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_document_invalid_file_extension(self):
        invalid_file = SimpleUploadedFile(
            "test.exe", b"file_content", content_type="application/octet-stream"
        )
        data = {
            "name": "New Document",
            "file": invalid_file,
            "classroom": self.classroom.id
        }
        response = self.client.post("/api/materials/", data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # def test_update_tags_valid(self):
    #     data = {"tag_ids": [self.tag1.id, self.tag2.id]}
    #     response = self.client.patch(f"/api/materials/{self.document.id}/update_tags/", data, format="json")
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(len(response.data["tags"]), 2)

    # def test_update_tags_invalid(self):
    #     data = {"tag_ids": [9999]}  # Non-existent tag ID
    #     response = self.client.patch(f"/api/materials/{self.document.id}/update_tags/", data, format="json")
    #     self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_all_user_materials(self):
        response = self.client.get("/api/materials/user_materials/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_extract_text_from_uploaded_file_invalid(self):
        invalid_file = SimpleUploadedFile(
            "test.txt",
            b"invalid content",
            content_type="text/plain"
        )
        response = self.client.post("/api/materials/extract-text/", {"file": invalid_file}, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_translate_text_invalid(self):
        data = {}
        response = self.client.post("/api/materials/translate/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_convert_text_to_docx_valid(self):
        data = {
            "text": "This is a test document.",
            "title": "Test Document"
        }
        response = self.client.post("/api/materials/convert-text-to-docx/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response["Content-Disposition"], 'attachment; filename="Test_Document.docx"')

    def test_convert_text_to_docx_invalid(self):
        data = {}
        response = self.client.post("/api/materials/convert-text-to-docx/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


    def test_convert_text_to_docx_and_upload_invalid(self):
        data = {
            "text": "This is a test document.",
            "title": "Test Document"
        }
        response = self.client.post("/api/materials/convert-text-to-docx-and-upload/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)