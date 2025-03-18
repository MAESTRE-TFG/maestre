from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from classrooms.models import Classroom
from .models import Student
from .serializers import StudentSerializer
from users.models import CustomUser
from schools.models import School

class StudentTests(APITestCase):
    def setUp(self):
        self.school = School.objects.create(name='TestSchool')
        self.classroom = Classroom.objects.create(name='TestClassroom', school=self.school)
        self.user = CustomUser.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword',
            name='Test',
            surname='User',
            region='TestRegion',
            city='TestCity',
            school=self.school
        )
        self.client = APIClient()
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        self.student = Student.objects.create(
            name='TestStudent',
            surname='StudentSurname',
            classroom=self.classroom
        )
        self.create_url = reverse('student-list')

    def test_create_student(self):
        data = {
            'name': 'NewStudent',
            'surname': 'NewSurname',
            'classroom_id': self.classroom.id
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Student.objects.count(), 2)
        self.assertEqual(Student.objects.get(name='NewStudent').surname, 'NewSurname')

    def test_create_student_without_classroom(self):
        data = {
            'name': 'NewStudent',
            'surname': 'NewSurname'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('classroom_id', response.data)

    def test_get_students(self):
        response = self.client.get(self.create_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_students_by_classroom(self):
        url = f"{self.create_url}?classroom_id={self.classroom.id}"
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_update_student(self):
        url = reverse('student-detail', kwargs={'pk': self.student.pk})
        data = {
            'name': 'UpdatedStudent',
            'surname': 'UpdatedSurname',
            'classroom_id': self.classroom.id
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.student.refresh_from_db()
        self.assertEqual(self.student.name, 'UpdatedStudent')
        self.assertEqual(self.student.surname, 'UpdatedSurname')

    def test_delete_student(self):
        url = reverse('student-detail', kwargs={'pk': self.student.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Student.objects.count(), 0)

    def test_create_student_with_blank_name(self):
        data = {
            'name': '',
            'surname': 'NewSurname',
            'classroom_id': self.classroom.id
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)

    def test_create_student_with_blank_surname(self):
        data = {
            'name': 'NewStudent',
            'surname': '',
            'classroom_id': self.classroom.id
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('surname', response.data)

    def test_update_student_with_invalid_classroom(self):
        url = reverse('student-detail', kwargs={'pk': self.student.pk})
        data = {
            'name': 'UpdatedStudent',
            'surname': 'UpdatedSurname',
            'classroom_id': 999
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
