from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Classroom
from users.models import CustomUser
from rest_framework.authtoken.models import Token


class ClassroomTests(APITestCase):

    def setUp(self):
        self.user = CustomUser.objects.create_user(username='testuser',
                                                   email='testuser@example.com',
                                                   password='testpass')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.classroom_data = {
            'name': 'Test Classroom',
            'academic_course': 'Math',
            'description': 'A test classroom',
            'academic_year': '2023-2024'
        }
        self.classroom = Classroom.objects.create(**self.classroom_data, creator=self.user)

    def test_create_classroom(self):
        url = reverse('classroom-list')
        response = self.client.post(url, self.classroom_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Classroom.objects.count(), 2)

    def test_create_classroom_invalid_data(self):
        url = reverse('classroom-list')
        invalid_data = self.classroom_data.copy()
        invalid_data['academic_year'] = 'invalid-year'
        response = self.client.post(url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_classroom(self):
        url = reverse('classroom-detail', args=[self.classroom.id])
        updated_data = self.classroom_data.copy()
        updated_data['name'] = 'Updated Classroom'
        response = self.client.patch(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.classroom.refresh_from_db()
        self.assertEqual(self.classroom.name, 'Updated Classroom')

    def test_update_classroom_no_permission(self):
        other_user = CustomUser.objects.create_user(username='otheruser',
                                                    email='otheruser@example.com',
                                                    password='otherpass')
        other_token = Token.objects.create(user=other_user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + other_token.key)
        url = reverse('classroom-detail', args=[self.classroom.id])
        updated_data = self.classroom_data.copy()
        updated_data['name'] = 'Updated Classroom'
        response = self.client.patch(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_classroom(self):
        url = reverse('classroom-detail', args=[self.classroom.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Classroom.objects.count(), 0)

    def test_delete_classroom_no_permission(self):
        other_user = CustomUser.objects.create_user(username='otheruser',
                                                    email='otheruser@example.com',
                                                    password='otherpass')
        other_token = Token.objects.create(user=other_user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + other_token.key)
        url = reverse('classroom-detail', args=[self.classroom.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Classroom.objects.count(), 1)
