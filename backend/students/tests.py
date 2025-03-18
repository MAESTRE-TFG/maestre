from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from classrooms.models import Classroom
from .models import Student
from .serializers import StudentSerializer
from users.models import CustomUser


class StudentModelTests(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword',
            name='Test',
            surname='User'
        )

        self.classroom = Classroom.objects.create(
            name='TestClassroom',
            academic_course='Test Course',
            description='Test Description',
            academic_year='2023-2024',
            creator=self.user
        )

        self.student = Student.objects.create(
            name='TestStudent',
            surname='StudentSurname',
            classroom=self.classroom
        )

    def test_student_creation(self):
        self.assertEqual(self.student.name, 'TestStudent')
        self.assertEqual(self.student.surname, 'StudentSurname')
        self.assertEqual(self.student.classroom, self.classroom)

    def test_student_string_representation(self):
        self.assertEqual(str(self.student), 'TestStudent')

    def test_student_classroom_relationship(self):
        self.assertEqual(self.classroom.student_set.count(), 1)
        self.assertEqual(self.classroom.student_set.first(), self.student)


class StudentSerializerTests(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword',
            name='Test',
            surname='User'
        )

        self.classroom = Classroom.objects.create(
            name='TestClassroom',
            academic_course='Test Course',
            description='Test Description',
            academic_year='2023-2024',
            creator=self.user
        )

        self.student_attributes = {
            'name': 'TestStudent',
            'surname': 'StudentSurname',
            'classroom': self.classroom.id
        }

        self.student = Student.objects.create(
            name='TestStudent',
            surname='StudentSurname',
            classroom=self.classroom
        )

        self.serializer = StudentSerializer(instance=self.student)

    def test_serializer_contains_expected_fields(self):
        data = self.serializer.data
        self.assertEqual(set(data.keys()), set(['id', 'name', 'surname', 'classroom']))

    def test_serializer_field_content(self):
        data = self.serializer.data
        self.assertEqual(data['name'], self.student_attributes['name'])
        self.assertEqual(data['surname'], self.student_attributes['surname'])
        self.assertEqual(data['classroom'], self.student_attributes['classroom'])

    def test_serializer_validation(self):
        # Test with valid data
        serializer = StudentSerializer(data=self.student_attributes)
        self.assertTrue(serializer.is_valid())

        # Test with missing name
        invalid_data = self.student_attributes.copy()
        invalid_data.pop('name')
        serializer = StudentSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)

        # Test with missing surname
        invalid_data = self.student_attributes.copy()
        invalid_data.pop('surname')
        serializer = StudentSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('surname', serializer.errors)

        # Test with missing classroom
        invalid_data = self.student_attributes.copy()
        invalid_data.pop('classroom')
        serializer = StudentSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('classroom', serializer.errors)


class StudentViewSetTests(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword',
            name='Test',
            surname='User'
        )

        self.classroom = Classroom.objects.create(
            name='TestClassroom',
            academic_course='Test Course',
            description='Test Description',
            academic_year='2023-2024',
            creator=self.user
        )

        self.classroom2 = Classroom.objects.create(
            name='TestClassroom2',
            academic_course='Test Course 2',
            description='Test Description 2',
            academic_year='2023-2024',
            creator=self.user
        )

        self.student = Student.objects.create(
            name='TestStudent',
            surname='StudentSurname',
            classroom=self.classroom
        )

        self.client = APIClient()
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")

        self.list_url = reverse('students-list')
        self.detail_url = reverse('students-detail', kwargs={'pk': self.student.pk})  # Changed from 'student-detail'

    def test_get_student_list(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_student_detail(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'TestStudent')

    def test_create_student(self):
        data = {
            'name': 'NewStudent',
            'surname': 'NewSurname',
            'classroom_id': self.classroom.id
        }
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Student.objects.count(), 2)
        self.assertEqual(Student.objects.get(name='NewStudent').surname, 'NewSurname')

    def test_create_student_without_classroom_id(self):
        data = {
            'name': 'NewStudent',
            'surname': 'NewSurname'
        }
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'classroom_id is required')

    def test_create_student_with_nonexistent_classroom(self):
        data = {
            'name': 'NewStudent',
            'surname': 'NewSurname',
            'classroom_id': 9999  # Non-existent classroom ID
        }
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_student(self):
        data = {
            'name': 'UpdatedStudent',
            'surname': 'UpdatedSurname',
            'classroom': self.classroom.id
        }
        response = self.client.put(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.student.refresh_from_db()
        self.assertEqual(self.student.name, 'UpdatedStudent')
        self.assertEqual(self.student.surname, 'UpdatedSurname')

    def test_partial_update_student(self):
        data = {
            'name': 'PartiallyUpdatedStudent'
        }
        response = self.client.patch(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.student.refresh_from_db()
        self.assertEqual(self.student.name, 'PartiallyUpdatedStudent')
        self.assertEqual(self.student.surname, 'StudentSurname')  # Unchanged

    def test_delete_student(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Student.objects.count(), 0)

    def test_filter_students_by_classroom(self):
        Student.objects.create(
            name='AnotherStudent',
            surname='AnotherSurname',
            classroom=self.classroom2
        )

        # Filter by first classroom
        url = f"{self.list_url}?classroom_id={self.classroom.id}"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'TestStudent')

        # Filter by second classroom
        url = f"{self.list_url}?classroom_id={self.classroom2.id}"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'AnotherStudent')

    def test_unauthorized_access(self):
        """Test that unauthorized users cannot access the API"""
        # Remove authentication
        self.client.credentials()

        # Try to access the list endpoint
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Try to access the detail endpoint
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Try to create a student
        data = {
            'name': 'UnauthorizedStudent',
            'surname': 'UnauthorizedSurname',
            'classroom_id': self.classroom.id
        }
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
