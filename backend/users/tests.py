from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from .models import CustomUser
from rest_framework.authtoken.models import Token
from schools.models import School
from django.core.exceptions import ValidationError
from django.contrib.auth.models import Group, Permission


class UserTests(APITestCase):
    def setUp(self):
        self.school = School.objects.create(name='TestSchool')
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
        self.create_url = reverse('customuser-list')
        self.client = APIClient()
        self.token = Token.objects.create(user=self.user)

    def test_create_user(self):
        self.client.force_authenticate(user=self.user)
        new_school = School.objects.create(name='NewSchool')
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpassword',
            'name': 'New',
            'surname': 'User',
            'region': 'Region',
            'city': 'City',
            'school': new_school.id
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CustomUser.objects.count(), 2)
        self.assertEqual(CustomUser.objects.get(username='newuser').email, 'newuser@example.com')
        self.assertEqual(CustomUser.objects.get(username='newuser').school, new_school)

    def test_create_user_with_existing_username(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'username': 'testuser',
            'email': 'newuser@example.com',
            'password': 'newpassword',
            'name': 'New',
            'surname': 'User',
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)

    def test_create_user_with_existing_email(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'username': 'newuser',
            'email': 'testuser@example.com',
            'password': 'newpassword',
            'name': 'New',
            'surname': 'User',
            'region': 'Region',
            'city': 'City',
            'school': 'School'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_create_user_with_invalid_email(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'username': 'newuser',
            'email': 'invalid-email',
            'password': 'newpassword',
            'name': 'New',
            'surname': 'User',
            'region': 'Region',
            'city': 'City',
            'school': 'School'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_create_user_with_blank_username(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'username': '',
            'email': 'newuser@example.com',
            'password': 'newpassword',
            'name': 'New',
            'surname': 'User',
            'region': 'Region',
            'city': 'City',
            'school': 'School'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)

    def test_create_user_with_blank_email(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'username': 'newuser',
            'email': '',
            'password': 'newpassword',
            'name': 'New',
            'surname': 'User',
            'region': 'Region',
            'city': 'City',
            'school': 'School'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_create_user_with_blank_password(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': '',
            'name': 'New',
            'surname': 'User',
            'region': 'Region',
            'city': 'City',
            'school': 'School'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_create_user_with_blank_name(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpassword',
            'name': '',
            'surname': 'User',
            'region': 'Region',
            'city': 'City',
            'school': 'School'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)

    def test_create_user_with_blank_surname(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpassword',
            'name': 'New',
            'surname': '',
            'region': 'Region',
            'city': 'City',
            'school': 'School'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('surname', response.data)

    def test_create_user_with_max_length_username(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'username': 'a' * 151,
            'email': 'newuser@example.com',
            'password': 'newpassword',
            'name': 'New',
            'surname': 'User',
            'region': 'Region',
            'city': 'City',
            'school': 'School'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)

    def test_create_user_with_max_length_email(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'username': 'newuser',
            'email': 'a' * 244 + '@example.com',
            'password': 'newpassword',
            'name': 'New',
            'surname': 'User',
            'region': 'Region',
            'city': 'City',
            'school': 'School'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_create_user_with_max_length_password(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'a' * 129,
            'name': 'New',
            'surname': 'User',
            'region': 'Region',
            'city': 'City',
            'school': 'School'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_create_user_with_max_length_name(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpassword',
            'name': 'a' * 151,
            'surname': 'User',
            'region': 'Region',
            'city': 'City',
            'school': 'School'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)

    def test_create_user_with_max_length_surname(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpassword',
            'name': 'New',
            'surname': 'a' * 151,
            'region': 'Region',
            'city': 'City',
            'school': 'School'
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('surname', response.data)

    def test_update_user_password(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('customuser-update-user', kwargs={'pk': self.user.pk})
        data = {
            'oldPassword': 'testpassword',  # Changed from 'old_password' to 'oldPassword'
            'password': 'newpassword123',
            'name': self.user.name,
            'surname': self.user.surname,
            'region': self.user.region,
            'city': self.user.city,
            'school': self.user.school.id
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpassword123'))

    def test_delete_user_without_authentication(self):
        self.client.force_authenticate(user=None)
        url = reverse('customuser-detail', kwargs={'pk': self.user.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

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

    def test_update_user_with_invalid_email(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('customuser-detail', kwargs={'pk': self.user.pk})
        data = {
            'email': 'invalid-email'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_update_user_with_blank_name(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('customuser-detail', kwargs={'pk': self.user.pk})
        data = {
            'name': ''
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)

    def test_update_user_with_blank_surname(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('customuser-detail', kwargs={'pk': self.user.pk})
        data = {
            'surname': ''
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('surname', response.data)

    def test_update_user_with_max_length_name(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('customuser-detail', kwargs={'pk': self.user.pk})
        data = {
            'name': 'a' * 151
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)

    def test_update_user_with_max_length_surname(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('customuser-detail', kwargs={'pk': self.user.pk})
        data = {
            'surname': 'a' * 151
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('surname', response.data)

    def test_delete_user(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('customuser-detail', kwargs={'pk': self.user.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(CustomUser.objects.count(), 0)

    def test_signin(self):
        url = reverse('customuser-signin')
        data = {
            'emailOrUsername': 'testuser@example.com',  # Changed from 'email_or_username' to 'emailOrUsername'
            'password': 'testpassword'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

    def test_signin_with_invalid_credentials(self):
        url = reverse('customuser-signin')
        data = {
            'emailOrUsername': 'testuser@example.com',  # Changed from 'email_or_username' to 'emailOrUsername'
            'password': 'wrongpassword'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.data)

    def test_signin_with_unregistered_email(self):
        url = reverse('customuser-signin')
        data = {
            'emailOrUsername': 'unregistered@example.com',  # Changed from 'email_or_username' to 'emailOrUsername'
            'password': 'testpassword'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.data)

    def test_signout(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        url = reverse('customuser-signout')
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertFalse(hasattr(self.user, 'auth_token'))

    def test_signout_without_authentication(self):
        url = reverse('customuser-signout')
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_signout_token_deletion_twice(self):

        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        url_signout = reverse('customuser-signout')
        response1 = self.client.post(url_signout)
        self.assertEqual(response1.status_code, status.HTTP_200_OK)

        response2 = self.client.post(url_signout)
        self.assertEqual(response2.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_user(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('customuser-update-user', kwargs={'pk': self.user.pk})
        new_school = School.objects.create(name='UpdatedSchool')
        data = {
            'name': 'Updated',
            'surname': 'User',
            'region': 'UpdatedRegion',
            'city': 'UpdatedCity',
            'school': new_school.id,
            'old_password': 'testpassword'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.name, 'Updated')
        self.assertEqual(self.user.surname, 'User')
        self.assertEqual(self.user.region, 'UpdatedRegion')
        self.assertEqual(self.user.city, 'UpdatedCity')
        self.assertEqual(self.user.school, new_school)

    def test_cleanup(self):
        """
        Final test to clean up all data generated during the test suite.
        This ensures the database is left in a clean state.
        """
        # Delete all users
        CustomUser.objects.all().delete()
        # Delete all schools
        School.objects.all().delete()
        # Delete all tokens
        Token.objects.all().delete()

        # Verify everything is deleted
        self.assertEqual(CustomUser.objects.count(), 0)
        self.assertEqual(School.objects.count(), 0)
        self.assertEqual(Token.objects.count(), 0)


class UserModelTests(APITestCase):
    def setUp(self):
        self.school = School.objects.create(name='TestSchool')

    def test_create_superuser(self):
        superuser = CustomUser.objects.create_superuser(
            email='admin@example.com',
            username='adminuser',
            password='adminpassword',
            name='Admin',
            surname='User',
            region='AdminRegion',
            city='AdminCity',
            school=self.school
        )
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)
        self.assertEqual(superuser.email, 'admin@example.com')

    def test_user_str_representation(self):
        user = CustomUser.objects.create_user(
            email='user@example.com',
            username='testuser',
            password='testpassword',
            name='Test',
            surname='User',
            school=self.school
        )
        self.assertEqual(str(user), 'user@example.com')

    def test_create_user_without_email(self):
        with self.assertRaises(ValueError) as context:
            CustomUser.objects.create_user(
                email=None,
                username='testuser',
                password='testpassword',
                name='Test',
                surname='User',
                school=self.school
            )
        self.assertEqual(str(context.exception), 'The Email field must be set')

    def test_user_groups_and_permissions(self):
        user = CustomUser.objects.create_user(
            email='user@example.com',
            username='testuser',
            password='testpassword',
            name='Test',
            surname='User',
            school=self.school
        )
        group = Group.objects.create(name='TestGroup')
        permission = Permission.objects.first()  # Get any permission
        user.groups.add(group)
        user.user_permissions.add(permission)

        self.assertIn(group, user.groups.all())
        self.assertIn(permission, user.user_permissions.all())

    def test_user_with_blank_fields(self):
        with self.assertRaises(ValidationError):
            user = CustomUser(
                email='',
                username='',
                name='',
                surname='',
                school=self.school
            )
            user.full_clean()  # This triggers validation


class UserViewSetTests(APITestCase):
    def setUp(self):
        self.school = School.objects.create(name='TestSchool')
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
        self.admin_user = CustomUser.objects.create_superuser(
            username='adminuser',
            email='admin@example.com',
            password='adminpassword',
            name='Admin',
            surname='User',
            region='AdminRegion',
            city='AdminCity',
            school=self.school
        )
        self.client = APIClient()
        self.token = Token.objects.create(user=self.user)
        self.admin_token = Token.objects.create(user=self.admin_user)

    def test_signup_authenticated_user(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('customuser-signup')
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpassword',
            'name': 'New',
            'surname': 'User',
            'region': 'Region',
            'city': 'City',
            'school': self.school.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('detail', response.data)

    def test_signin_invalid_format(self):
        url = reverse('customuser-signin')
        data = {
            'emailOrUsername': 'invalid_format',
            'password': 'testpassword'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.data)

    def test_signin_valid_username_invalid_password(self):
        url = reverse('customuser-signin')
        data = {
            'emailOrUsername': 'testuser',
            'password': 'wrongpassword'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.data)

    def test_signout_no_token(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('customuser-signout')
        self.token.delete()  # Simulate no token
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_check_role_admin(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.admin_token.key}")
        url = reverse('customuser-check-role')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user_role'], 'admin')
        self.assertTrue(response.data['is_admin'])

    def test_check_role_non_admin(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        url = reverse('customuser-check-role')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user_role'], 'user')
        self.assertFalse(response.data['is_admin'])

    def test_update_user_missing_old_password(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('customuser-update-user', kwargs={'pk': self.user.pk})
        data = {
            'password': 'newpassword123',
            'name': self.user.name,
            'surname': self.user.surname,
            'region': self.user.region,
            'city': self.user.city,
            'school': self.user.school.id
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('oldPassword', response.data)

    def test_delete_user_invalid_id(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('customuser-detail', kwargs={'pk': 9999})  # Non-existent user ID
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
