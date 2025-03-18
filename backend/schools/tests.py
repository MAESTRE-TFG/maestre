from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from .models import School
from users.models import CustomUser
from rest_framework.authtoken.models import Token


class SchoolTests(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword',
            name='Test',
            surname='User'
        )
        self.school = School.objects.create(
            name='Test School',
            community='Test Community',
            city='Test City',
            stages='Primary, Secondary'
        )
        self.create_url = reverse('school-list')
        self.client = APIClient()
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")

    def test_create_school(self):
        data = {
            'name': 'New School',
            'community': 'New Community',
            'city': 'New City',
            'stages': 'Primary, Secondary'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(School.objects.count(), 2)
        self.assertEqual(School.objects.get(name='New School').city, 'New City')

    def test_create_school_with_blank_name(self):
        data = {
            'name': '',
            'community': 'New Community',
            'city': 'New City',
            'stages': 'Primary, Secondary'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)

    def test_create_school_with_blank_community(self):
        data = {
            'name': 'New School',
            'community': '',
            'city': 'New City',
            'stages': 'Primary, Secondary'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('community', response.data)

    def test_create_school_with_blank_city(self):
        data = {
            'name': 'New School',
            'community': 'New Community',
            'city': '',
            'stages': 'Primary, Secondary'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('city', response.data)

    def test_create_school_with_blank_stages(self):
        data = {
            'name': 'New School',
            'community': 'New Community',
            'city': 'New City',
            'stages': ''
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('stages', response.data)

    def test_create_school_with_max_length_name(self):
        data = {
            'name': 'a' * 201,
            'community': 'New Community',
            'city': 'New City',
            'stages': 'Primary, Secondary'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)

    def test_create_school_with_max_length_community(self):
        data = {
            'name': 'New School',
            'community': 'a' * 101,
            'city': 'New City',
            'stages': 'Primary, Secondary'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('community', response.data)

    def test_create_school_with_max_length_city(self):
        data = {
            'name': 'New School',
            'community': 'New Community',
            'city': 'a' * 101,
            'stages': 'Primary, Secondary'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('city', response.data)

    def test_create_school_with_max_length_stages(self):
        data = {
            'name': 'New School',
            'community': 'New Community',
            'city': 'New City',
            'stages': 'a' * 501
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('stages', response.data)

    def test_update_school(self):
        url = reverse('school-detail', kwargs={'pk': self.school.pk})
        data = {
            'name': 'Updated School',
            'community': 'Updated Community',
            'city': 'Updated City',
            'stages': 'Primary, Secondary, Tertiary'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.school.refresh_from_db()
        self.assertEqual(self.school.name, 'Updated School')
        self.assertEqual(self.school.community, 'Updated Community')
        self.assertEqual(self.school.city, 'Updated City')
        self.assertEqual(self.school.stages, 'Primary, Secondary, Tertiary')

    def test_update_school_with_blank_name(self):
        url = reverse('school-detail', kwargs={'pk': self.school.pk})
        data = {
            'name': ''
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)

    def test_update_school_with_blank_community(self):
        url = reverse('school-detail', kwargs={'pk': self.school.pk})
        data = {
            'community': ''
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('community', response.data)

    def test_update_school_with_blank_city(self):
        url = reverse('school-detail', kwargs={'pk': self.school.pk})
        data = {
            'city': ''
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('city', response.data)

    def test_update_school_with_blank_stages(self):
        url = reverse('school-detail', kwargs={'pk': self.school.pk})
        data = {
            'stages': ''
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('stages', response.data)

    def test_update_school_with_max_length_name(self):
        url = reverse('school-detail', kwargs={'pk': self.school.pk})
        data = {
            'name': 'a' * 201
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)

    def test_update_school_with_max_length_community(self):
        url = reverse('school-detail', kwargs={'pk': self.school.pk})
        data = {
            'community': 'a' * 101
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('community', response.data)

    def test_update_school_with_max_length_city(self):
        url = reverse('school-detail', kwargs={'pk': self.school.pk})
        data = {
            'city': 'a' * 101
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('city', response.data)

    def test_update_school_with_max_length_stages(self):
        url = reverse('school-detail', kwargs={'pk': self.school.pk})
        data = {
            'stages': 'a' * 501
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('stages', response.data)

    def test_partial_update_school(self):
        url = reverse('school-detail', kwargs={'pk': self.school.pk})
        data = {
            'city': 'Partially Updated City'
        }
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.school.refresh_from_db()
        self.assertEqual(self.school.city, 'Partially Updated City')

    def test_delete_school_without_authentication(self):
        self.client.credentials()
        url = reverse('school-detail', kwargs={'pk': self.school.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_school_as_staff(self):
        self.user.is_staff = True
        self.user.save()
        url = reverse('school-detail', kwargs={'pk': self.school.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(School.objects.count(), 0)

    def test_delete_school_as_non_staff(self):
        self.user.is_staff = False
        self.user.save()
        url = reverse('school-detail', kwargs={'pk': self.school.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(School.objects.count(), 1)

    def test_filter_schools_by_city(self):
        School.objects.create(
            name='Another School',
            community='Another Community',
            city='Another City',
            stages='Primary'
        )

        response = self.client.get(f"{self.create_url}?city=Test City")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Test School')

        response = self.client.get(f"{self.create_url}?city=Another City")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Another School')

        response = self.client.get(self.create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_user_school_assignment_after_creation(self):
        data = {
            'name': 'New School',
            'community': 'New Community',
            'city': 'New City',
            'stages': 'Primary, Secondary'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.user.refresh_from_db()
        self.assertIsNotNone(self.user.school)
        self.assertEqual(self.user.school.name, 'New School')
