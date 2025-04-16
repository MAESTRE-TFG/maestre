from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Tag
from materials.models import Document
from classrooms.models import Classroom

User = get_user_model()


class TagTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password"
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        # Create initial data
        self.tag = Tag.objects.create(name="Test Tag", creator=self.user)
        self.classroom = Classroom.objects.create(name="Test Classroom", creator=self.user)
        self.document = Document.objects.create(name="Test Document", classroom=self.classroom)

    # Positive Test Cases
    def test_create_tag(self):
        response = self.client.post('/api/tags/', {"name": "New Tag", "color": "#FF5733"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Tag.objects.count(), 2)

    def test_get_user_tags(self):
        response = self.client.get('/api/tags/user_tags/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_delete_tag(self):
        response = self.client.delete(f'/api/tags/{self.tag.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Tag.objects.count(), 0)

    def test_filter_documents_by_tags(self):
        self.document.tags.add(self.tag)
        response = self.client.get('/api/tags/filtered_documents/',
                                   {'tags': 'Test Tag', 'classroom_id': self.classroom.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_update_tag(self):
        response = self.client.patch(f'/api/tags/{self.tag.id}/', {"name": "Updated Tag"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Tag.objects.get(id=self.tag.id).name, "Updated Tag")

    def test_partial_update_tag_color(self):
        response = self.client.patch(f'/api/tags/{self.tag.id}/', {"color": "#00FF00"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Tag.objects.get(id=self.tag.id).color, "#00FF00")

    # ------------ Negative Test Cases ------------
    def test_create_duplicate_tag(self):
        response = self.client.post('/api/tags/', {"name": "Test Tag"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_nonexistent_tag(self):
        response = self.client.delete('/api/tags/999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_filter_documents_invalid_tag(self):
        response = self.client.get('/api/tags/filtered_documents/',
                                   {'tags': 'Invalid Tag', 'classroom_id': self.classroom.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_create_tag_invalid_color(self):
        response = self.client.post('/api/tags/', {"name": "Invalid Color", "color": "invalid"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Invalid hexadecimal color code.', str(response.data))

    def test_update_tag_invalid_name(self):
        response = self.client.patch(f'/api/tags/{self.tag.id}/', {"name": ""}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_tag_missing_name(self):
        response = self.client.post('/api/tags/', {"color": "#FF5733"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_tag_invalid_hex_color(self):
        response = self.client.post('/api/tags/', {"name": "Invalid Color", "color": "123456"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Invalid hexadecimal color code.', str(response.data))

    def test_filter_documents_no_tags(self):
        response = self.client.get('/api/tags/filtered_documents/', {'classroom_id': self.classroom.id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_filter_documents_nonexistent_classroom(self):
        response = self.client.get('/api/tags/filtered_documents/', {'tags': 'Test Tag', 'classroom_id': 999})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_delete_tag_assigned_to_document(self):
        self.document.tags.add(self.tag)
        response = self.client.delete(f'/api/tags/{self.tag.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Tag.objects.count(), 0)
        self.assertEqual(self.document.tags.count(), 0)

    def test_create_tag_exceed_character_limit(self):
        long_name = "x" * 51  # Exceeds the 50-character limit
        response = self.client.post('/api/tags/', {"name": long_name, "color": "#FF5733"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_tags_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get('/api/tags/user_tags/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('Authentication credentials were not provided.', str(response.data))

    def test_filtered_documents_no_classroom(self):
        self.document.tags.add(self.tag)
        response = self.client.get('/api/tags/filtered_documents/', {'tags': 'Test Tag'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('classroom_id', str(response.data))

    def test_filtered_documents_no_tags(self):
        response = self.client.get('/api/tags/filtered_documents/', {'classroom_id': self.classroom.id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Tags are required', str(response.data))

    def test_filtered_documents_empty_result(self):
        response = self.client.get('/api/tags/filtered_documents/',
                                   {'tags': 'Nonexistent Tag', 'classroom_id': self.classroom.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_create_tag_invalid_data(self):
        response = self.client.post('/api/tags/', {"name": "", "color": "invalid"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Invalid hexadecimal color code', str(response.data))
        self.assertIn('This field may not be blank.', str(response.data))

    def test_destroy_tag_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.delete(f'/api/tags/{self.tag.id}/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('Authentication credentials were not provided.', str(response.data))

    def test_destroy_nonexistent_tag(self):
        response = self.client.delete('/api/tags/999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('Tag not found', str(response.data))

    def test_create_tag_with_default_color(self):
        response = self.client.post('/api/tags/', {"name": "Default Color Tag"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Tag.objects.get(name="Default Color Tag").color, "#808080")

    def test_create_tag_missing_color(self):
        response = self.client.post('/api/tags/', {"name": "Tag Without Color"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Tag.objects.get(name="Tag Without Color").color, "#808080")  # Default color

    def test_create_tag_invalid_data_combined(self):
        response = self.client.post('/api/tags/', {"name": "", "color": "12345"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('This field may not be blank.', str(response.data))
        self.assertIn('Invalid hexadecimal color code.', str(response.data))

    def test_filtered_documents_invalid_classroom_id(self):
        response = self.client.get('/api/tags/filtered_documents/', {'tags': 'Test Tag', 'classroom_id': 'invalid'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('classroom_id must be a valid integer.', str(response.data))  # Updated assertion

    def test_filtered_documents_no_results(self):
        response = self.client.get('/api/tags/filtered_documents/',
                                   {'tags': 'Nonexistent Tag', 'classroom_id': self.classroom.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_user_tags_no_tags(self):
        Tag.objects.all().delete()
        response = self.client.get('/api/tags/user_tags/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_destroy_tag_invalid_user(self):
        other_user = User.objects.create_user(username="otheruser", email="other@example.com", password="password")
        other_tag = Tag.objects.create(name="Other User Tag", creator=other_user)
        response = self.client.delete(f'/api/tags/{other_tag.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('Tag not found', str(response.data))

    def test_filtered_documents_user_no_tags(self):
        response = self.client.get('/api/tags/filtered_documents_user/', {'tags': ''})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Tags are required', str(response.data))

    def test_cleanup_generated_data(self):
        # Ensure data exists before cleanup
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(Tag.objects.count(), 1)
        self.assertEqual(Classroom.objects.count(), 1)
        self.assertEqual(Document.objects.count(), 1)

        # Delete all data
        Document.objects.all().delete()
        Tag.objects.all().delete()
        Classroom.objects.all().delete()
        User.objects.all().delete()

        # Ensure all data is removed
        self.assertEqual(User.objects.count(), 0)
        self.assertEqual(Tag.objects.count(), 0)
        self.assertEqual(Classroom.objects.count(), 0)
        self.assertEqual(Document.objects.count(), 0)
