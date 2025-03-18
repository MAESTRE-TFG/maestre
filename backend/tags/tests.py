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
        self.create_url = reverse('tags')

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

    def test_get_tag_detail(self):
        tag = Tag.objects.create(
            name='Detail Tag',
            color='#FF0000',
            creator=self.user
        )
        url = reverse('tag-detail', kwargs={'pk': tag.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Detail Tag')
        self.assertEqual(response.data['color'], '#FF0000')

    def test_access_other_user_tag(self):
        # Create another user
        other_user = CustomUser.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='otherpassword'
        )
        
        # Create a tag for the other user
        other_tag = Tag.objects.create(
            name='Other User Tag',
            color='#00FF00',
            creator=other_user
        )
        
        # Try to access the other user's tag
        url = reverse('tag-detail', kwargs={'pk': other_tag.pk})
        response = self.client.get(url)
        
        # Should return 404 as users should only access their own tags
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_other_user_tag(self):
        # Create another user
        other_user = CustomUser.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='otherpassword'
        )
        
        # Create a tag for the other user
        other_tag = Tag.objects.create(
            name='Other User Tag',
            color='#00FF00',
            creator=other_user
        )
        
        # Try to update the other user's tag
        url = reverse('tag-detail', kwargs={'pk': other_tag.pk})
        data = {
            'name': 'Attempted Update'
        }
        response = self.client.patch(url, data, format='json')
        
        # Should return 404 as users should only update their own tags
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        # Verify the tag wasn't updated
        other_tag.refresh_from_db()
        self.assertEqual(other_tag.name, 'Other User Tag')

    def test_delete_other_user_tag(self):
        # Create another user
        other_user = CustomUser.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='otherpassword'
        )
        
        # Create a tag for the other user
        other_tag = Tag.objects.create(
            name='Other User Tag',
            color='#00FF00',
            creator=other_user
        )
        
        # Try to delete the other user's tag
        url = reverse('tag-detail', kwargs={'pk': other_tag.pk})
        response = self.client.delete(url)
        
        # Should return 404 as users should only delete their own tags
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        # Verify the tag wasn't deleted
        self.assertTrue(Tag.objects.filter(pk=other_tag.pk).exists())

    def test_list_only_user_tags(self):
        # Create tags for the current user
        Tag.objects.create(
            name='User Tag 1',
            color='#FF0000',
            creator=self.user
        )
        Tag.objects.create(
            name='User Tag 2',
            color='#00FF00',
            creator=self.user
        )
        
        # Create another user
        other_user = CustomUser.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='otherpassword'
        )
        
        # Create a tag for the other user
        Tag.objects.create(
            name='Other User Tag',
            color='#0000FF',
            creator=other_user
        )
        
        # Get the list of tags
        response = self.client.get(self.create_url)
        
        # Should only return the current user's tags
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        tag_names = [tag['name'] for tag in response.data]
        self.assertIn('User Tag 1', tag_names)
        self.assertIn('User Tag 2', tag_names)
        self.assertNotIn('Other User Tag', tag_names)

    def test_create_tag_with_blank_name(self):
        data = {
            'name': '',
            'color': '#FF0000'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)

    def test_create_tag_with_long_name(self):
        data = {
            'name': 'a' * 101,  # Assuming max length is 100
            'color': '#FF0000'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)

    def test_filtered_documents_action(self):
        # This test assumes there's a filtered_documents action in the TagViewSet
        # Create a tag
        tag = Tag.objects.create(
            name='Filter Tag',
            color='#FF0000',
            creator=self.user
        )
        
        # Try to access the filtered_documents action
        url = reverse('tag-filtered-documents')
        response = self.client.get(url, {'tags': tag.name})
        
        # The response should be successful (even if no documents are found)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
