import os
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from .models import Document
from classrooms.models import Classroom
from tags.models import Tag
from users.models import CustomUser
from rest_framework.authtoken.models import Token


class DocumentTests(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword'
        )
        self.classroom = Classroom.objects.create(name='TestClassroom', creator=self.user)
        self.client = APIClient()
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        self.create_url = reverse('document-list')

    def test_create_document(self):
        data = {
            'name': 'Test Document',
            'file': 'testfile.pdf',
            'classroom': self.classroom.id
        }
        response = self.client.post(self.create_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Document.objects.count(), 1)
        self.assertEqual(Document.objects.get().name, 'Test Document')

    def test_create_document_exceeding_limit(self):
        for i in range(5):
            Document.objects.create(
                name=f'Document {i}',
                file='testfile.pdf',
                classroom=self.classroom
            )
        data = {
            'name': 'Exceeding Document',
            'file': 'testfile.pdf',
            'classroom': self.classroom.id
        }
        response = self.client.post(self.create_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_update_document(self):
        document = Document.objects.create(
            name='Old Document',
            file='testfile.pdf',
            classroom=self.classroom
        )
        url = reverse('document-detail', kwargs={'pk': document.pk})
        data = {
            'name': 'Updated Document'
        }
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        document.refresh_from_db()
        self.assertEqual(document.name, 'Updated Document')

    def test_delete_document(self):
        document = Document.objects.create(
            name='Document to delete',
            file='testfile.pdf',
            classroom=self.classroom
        )
        url = reverse('document-detail', kwargs={'pk': document.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Document.objects.count(), 0)

    def test_get_all_user_materials(self):
        Document.objects.create(
            name='User Document',
            file='testfile.pdf',
            classroom=self.classroom
        )
        url = reverse('get_all_user_materials')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_document_with_tags(self):
        tag1 = Tag.objects.create(name='Tag1')
        tag2 = Tag.objects.create(name='Tag2')
        data = {
            'name': 'Document with tags',
            'file': 'testfile.pdf',
            'classroom': self.classroom.id,
            'tag_ids': [tag1.id, tag2.id]
        }
        response = self.client.post(self.create_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        document = Document.objects.get()
        self.assertEqual(document.tags.count(), 2)

    def test_update_document_tags(self):
        document = Document.objects.create(
            name='Document',
            file='testfile.pdf',
            classroom=self.classroom
        )
        tag1 = Tag.objects.create(name='Tag1')
        tag2 = Tag.objects.create(name='Tag2')
        url = reverse('document-update-tags', kwargs={'pk': document.pk})
        data = {
            'tag_ids': [tag1.id, tag2.id]
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        document.refresh_from_db()
        self.assertEqual(document.tags.count(), 2)

    def test_create_document_with_invalid_file_extension(self):
        data = {
            'name': 'Invalid Document',
            'file': 'invalidfile.txt',
            'classroom': self.classroom.id
        }
        response = self.client.post(self.create_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('file', response.data)

    def test_create_document_without_authentication(self):
        self.client.credentials()  # Remove authentication
        data = {
            'name': 'Test Document',
            'file': 'testfile.pdf',
            'classroom': self.classroom.id
        }
        response = self.client.post(self.create_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_document_without_authentication(self):
        document = Document.objects.create(
            name='Old Document',
            file='testfile.pdf',
            classroom=self.classroom
        )
        self.client.credentials()  # Remove authentication
        url = reverse('document-detail', kwargs={'pk': document.pk})
        data = {
            'name': 'Updated Document'
        }
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_document_without_authentication(self):
        document = Document.objects.create(
            name='Document to delete',
            file='testfile.pdf',
            classroom=self.classroom
        )
        self.client.credentials()  # Remove authentication
        url = reverse('document-detail', kwargs={'pk': document.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
