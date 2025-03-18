from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from .models import Tag
from users.models import CustomUser
from rest_framework.authtoken.models import Token


class TagTests(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword'
        )
        self.client = APIClient()
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        self.create_url = reverse('tag-list')

    def test_create_tag(self):
        data = {
            'name': 'Test Tag',
            'color': '#FF0000'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Tag.objects.count(), 1)
        self.assertEqual(Tag.objects.get().name, 'Test Tag')

    def test_create_tag_exceeding_limit(self):
        for i in range(15):
            Tag.objects.create(
                name=f'Tag {i}',
                creator=self.user
            )
        data = {
            'name': 'Exceeding Tag',
            'color': '#FF0000'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_update_tag(self):
        tag = Tag.objects.create(
            name='Old Tag',
            creator=self.user
        )
        url = reverse('tag-detail', kwargs={'pk': tag.pk})
        data = {
            'name': 'Updated Tag'
        }
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        tag.refresh_from_db()
        self.assertEqual(tag.name, 'Updated Tag')

    def test_delete_tag(self):
        tag = Tag.objects.create(
            name='Tag to delete',
            creator=self.user
        )
        url = reverse('tag-detail', kwargs={'pk': tag.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Tag.objects.count(), 0)

    def test_get_user_tags(self):
        Tag.objects.create(
            name='User Tag',
            creator=self.user
        )
        url = reverse('tag-user_tags')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_tag_without_authentication(self):
        self.client.credentials()  # Remove authentication
        data = {
            'name': 'Test Tag',
            'color': '#FF0000'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_tag_without_authentication(self):
        tag = Tag.objects.create(
            name='Old Tag',
            creator=self.user
        )
        self.client.credentials()  # Remove authentication
        url = reverse('tag-detail', kwargs={'pk': tag.pk})
        data = {
            'name': 'Updated Tag'
        }
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_tag_without_authentication(self):
        tag = Tag.objects.create(
            name='Tag to delete',
            creator=self.user
        )
        self.client.credentials()  # Remove authentication
        url = reverse('tag-detail', kwargs={'pk': tag.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_tag_with_duplicate_name(self):
        Tag.objects.create(
            name='Duplicate Tag',
            creator=self.user
        )
        data = {
            'name': 'Duplicate Tag',
            'color': '#FF0000'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)

    def test_create_tag_with_invalid_color(self):
        data = {
            'name': 'Invalid Color Tag',
            'color': 'invalidcolor'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('color', response.data)
