from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.core.exceptions import ValidationError
from django.test import TestCase
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


class ClassroomModelTests(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password"
        )
        self.classroom_data = {
            'name': 'Test Classroom',
            'academic_course': 'Math',
            'description': 'A test classroom',
            'academic_year': '2023-2024',
            'creator': self.user
        }

    def test_create_classroom(self):
        classroom = Classroom.objects.create(**self.classroom_data)
        self.assertEqual(classroom.name, 'Test Classroom')
        self.assertEqual(classroom.academic_course, 'Math')
        self.assertEqual(classroom.description, 'A test classroom')
        self.assertEqual(classroom.academic_year, '2023-2024')
        self.assertEqual(classroom.creator, self.user)

    def test_academic_year_validation(self):
        # Test valid academic year
        classroom = Classroom(**self.classroom_data)
        try:
            classroom.clean()
        except ValidationError:
            self.fail("ValidationError raised for a valid academic year.")

        # Test invalid academic year format
        invalid_data = self.classroom_data.copy()
        invalid_data['academic_year'] = '2023/2024'
        classroom = Classroom(**invalid_data)
        with self.assertRaises(ValidationError) as context:
            classroom.clean()
        self.assertIn('Academic year must be in the format YYYY-YYYY.', str(context.exception))

        # Test empty academic year
        invalid_data['academic_year'] = ''
        classroom = Classroom(**invalid_data)
        with self.assertRaises(ValidationError) as context:
            classroom.clean()
        self.assertIn('Academic year cannot be empty.', str(context.exception))

    def test_number_of_students_property(self):
        classroom = Classroom.objects.create(**self.classroom_data)
        self.assertEqual(classroom.number_of_students, 0)

    def test_string_representation(self):
        classroom = Classroom.objects.create(**self.classroom_data)
        self.assertEqual(str(classroom), 'Test Classroom')

    def test_classroom_ordering(self):
        Classroom.objects.create(**{**self.classroom_data, 'name': 'B Classroom'})
        Classroom.objects.create(**{**self.classroom_data, 'name': 'A Classroom'})
        classrooms = Classroom.objects.all()
        self.assertEqual(classrooms[0].name, 'A Classroom')
        self.assertEqual(classrooms[1].name, 'B Classroom')


class ClassroomViewSetAdditionalTests(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword'
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")

        self.classroom_data = {
            'name': 'Test Classroom',
            'academic_course': 'Math',
            'description': 'A test classroom',
            'academic_year': '2023-2024'
        }
        self.classroom = Classroom.objects.create(**self.classroom_data, creator=self.user)

    def test_get_queryset_unauthenticated(self):
        self.client.credentials()  # Remove authentication
        response = self.client.get(reverse('classroom-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_classroom_max_limit_reached(self):
        # Simulate reaching the maximum number of classrooms
        with self.settings(MAX_CLASSROOMS_PER_TEACHER=1):
            response = self.client.post(reverse('classroom-list'), self.classroom_data, format='json')
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertIn('You cannot create more than 1 classrooms.', str(response.data))

    def test_update_classroom_invalid_data(self):
        url = reverse('classroom-detail', args=[self.classroom.id])
        invalid_data = self.classroom_data.copy()
        invalid_data['academic_year'] = 'invalid-year'
        response = self.client.patch(url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Validation error occurred.', str(response.data))

    def test_destroy_classroom_no_permission(self):
        other_user = CustomUser.objects.create_user(
            username='otheruser',
            email='otheruser@example.com',
            password='otherpassword'
        )
        other_token = Token.objects.create(user=other_user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {other_token.key}")
        url = reverse('classroom-detail', args=[self.classroom.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Classroom.objects.count(), 1)

    def test_check_object_permissions_not_creator_or_staff(self):
        other_user = CustomUser.objects.create_user(
            username='otheruser',
            email='otheruser@example.com',
            password='otherpassword'
        )
        other_token = Token.objects.create(user=other_user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {other_token.key}")
        url = reverse('classroom-detail', args=[self.classroom.id])
        response = self.client.patch(url, {'name': 'Updated Name'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('You do not have permission to perform this action.', str(response.data))
