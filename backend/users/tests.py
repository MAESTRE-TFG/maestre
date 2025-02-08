from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from .models import CustomUser

class UserTests(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword',
            name='Test',
            surname='User'
        )
        self.create_url = reverse('customuser-list')
        self.client = APIClient()

    def test_create_user(self):
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpassword',
            'name': 'New',
            'surname': 'User'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CustomUser.objects.count(), 2)
        self.assertEqual(CustomUser.objects.get(username='newuser').email, 'newuser@example.com')

    def test_create_user_with_existing_username(self):
        data = {
            'username': 'testuser',
            'email': 'newuser@example.com',
            'password': 'newpassword',
            'name': 'New',
            'surname': 'User'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)

    def test_create_user_with_invalid_email(self):
        data = {
            'username': 'newuser',
            'email': 'invalid-email',
            'password': 'newpassword',
            'name': 'New',
            'surname': 'User'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_update_user(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('customuser-detail', kwargs={'pk': self.user.pk})
        data = {
            'name': 'Updated',
            'surname': 'User'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.name, 'Updated')
        self.assertEqual(self.user.surname, 'User')

    def test_update_user_with_invalid_email(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('customuser-detail', kwargs={'pk': self.user.pk})
        data = {
            'email': 'invalid-email'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_partial_update_user(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('customuser-detail', kwargs={'pk': self.user.pk})
        data = {
            'surname': 'UpdatedSurname'
        }
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.surname, 'UpdatedSurname')

    def test_update_user_password(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('customuser-detail', kwargs={'pk': self.user.pk})
        data = {
            'password': 'newpassword123'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpassword123'))

    def test_delete_user(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('customuser-detail', kwargs={'pk': self.user.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(CustomUser.objects.count(), 0)

    def test_delete_user_without_authentication(self):
        url = reverse('customuser-detail', kwargs={'pk': self.user.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
