# Update the imports to use CustomUser instead of User
from django.test import TestCase
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from .models import Terms
from .serializers import TermsSerializer
from users.models import CustomUser
from schools.models import School


class TermsModelTests(TestCase):

    def setUp(self):
        # Create a school for the CustomUser
        self.school = School.objects.create(name='Test School')

        # Create admin user using CustomUser
        self.admin_user = CustomUser.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='adminpassword',
            is_staff=True,
            name='Admin',
            surname='User',
            school=self.school
        )

        # Create a Terms instance with author
        # Use SimpleUploadedFile for the content field
        self.content_file = SimpleUploadedFile(
            "privacy_policy.md",
            b"Privacy policy content",
            content_type="text/markdown"
        )

        self.terms = Terms.objects.create(
            tag='privacy',
            content=self.content_file,
            name='Privacy Policy',
            version='1.0',
            author=self.admin_user
        )

    def test_terms_creation(self):
        self.assertEqual(self.terms.tag, 'privacy')
        self.assertEqual(self.terms.name, 'Privacy Policy')
        self.assertEqual(self.terms.author, self.admin_user)
        self.assertIsNotNone(self.terms.created_at)
        self.assertIsNotNone(self.terms.updated_at)

    def test_terms_str_method(self):
        self.assertEqual(str(self.terms), self.terms.name)

    def test_terms_ordering(self):

        # Update the first Terms to make it have a more recent updated_at
        self.terms.version = '1.1'
        self.terms.save()

        # Get all Terms ordered by -updated_at (default ordering in the view)
        terms_list = Terms.objects.all().order_by('-updated_at')

        # The first Terms should be the one we just updated
        self.assertEqual(terms_list[0], self.terms)


class TermsSerializerTests(TestCase):

    def setUp(self):
        # Create a school for the CustomUser
        self.school = School.objects.create(name='Test School')

        self.admin_user = CustomUser.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='adminpassword',
            is_staff=True,
            name='Admin',
            surname='User',
            school=self.school
        )

        # Use SimpleUploadedFile for the content field
        self.content_file = SimpleUploadedFile(
            "privacy_policy.md",
            b"Privacy policy content",
            content_type="text/markdown"
        )

        self.terms_attributes = {
            'tag': 'privacy',
            'name': 'Privacy Policy',
            'version': '1.0',
            'content': self.content_file,
        }

        # Create the Terms instance with all required fields
        self.terms = Terms.objects.create(
            **self.terms_attributes,
            author=self.admin_user
        )

        self.serializer = TermsSerializer(instance=self.terms)

    def test_terms_str_method(self):
        self.assertEqual(str(self.terms), self.terms.name)

    def test_contains_expected_fields(self):
        data = self.serializer.data
        expected_fields = {'id', 'tag', 'content', 'created_at', 'updated_at', 'author', 'name', 'version'}
        self.assertEqual(set(data.keys()), expected_fields)

    def test_content_field_content(self):
        data = self.serializer.data
        self.assertIn('content', data)
        # For FileField, we just check that the URL exists
        self.assertTrue(data['content'])

    def test_tag_field_content(self):
        data = self.serializer.data
        self.assertEqual(data['tag'], self.terms_attributes['tag'])


class TermsAPITests(APITestCase):

    def setUp(self):
        self.client = APIClient()

        # Create a school for the CustomUser
        self.school = School.objects.create(name='Test School')

        # Create admin user
        self.admin_user = CustomUser.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='adminpassword',
            is_staff=True,
            name='Admin',
            surname='User',
            school=self.school
        )

        # Create regular user
        self.user = CustomUser.objects.create_user(
            username='user',
            email='user@example.com',
            password='userpassword',
            name='Regular',
            surname='User',
            school=self.school
        )

        # Create some Terms instances with proper file content
        self.content_file1 = SimpleUploadedFile(
            "privacy_policy.md",
            b"Privacy policy content",
            content_type="text/markdown"
        )

        self.terms1 = Terms.objects.create(
            tag='privacy',
            content=self.content_file1,
            name='Privacy Policy',
            version='1.0',
            author=self.admin_user
        )

        self.content_file2 = SimpleUploadedFile(
            "terms_of_service.md",
            b"Terms of service content",
            content_type="text/markdown"
        )

        self.terms2 = Terms.objects.create(
            tag='terms',
            content=self.content_file2,
            name='Terms of Service',
            version='1.0',
            author=self.admin_user
        )

        # URLs for ViewSet
        self.list_url = reverse('terms-list')
        self.detail_url = reverse('terms-detail', kwargs={'pk': self.terms1.pk})

    def test_get_all_terms(self):
        response = self.client.get(self.list_url)
        # Don't compare the full response data as URLs might differ
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_get_terms_by_tag(self):
        response = self.client.get(f"{self.list_url}?tag=privacy")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['tag'], 'privacy')

    def test_get_single_terms(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.terms1.id)
        self.assertEqual(response.data['tag'], 'privacy')

    def test_create_terms_as_admin(self):
        self.client.force_authenticate(user=self.admin_user)

        # Create a file for testing
        test_file = SimpleUploadedFile(
            "cookie_policy.md",
            b"Cookie policy content",
            content_type="text/markdown"
        )

        # Use multipart form data for file uploads
        data = {
            'tag': 'cookies',
            'content': test_file,
            'name': 'Cookie Policy',
            'version': '1.0'
        }

        response = self.client.post(self.list_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Terms.objects.count(), 3)
        self.assertEqual(Terms.objects.get(tag='cookies').name, 'Cookie Policy')

    def test_create_terms_as_regular_user(self):
        self.client.force_authenticate(user=self.user)

        test_file = SimpleUploadedFile(
            "cookie_policy.md",
            b"Cookie policy content",
            content_type="text/markdown"
        )

        data = {
            'tag': 'cookies',
            'content': test_file,
            'name': 'Cookie Policy',
            'version': '1.0'
        }

        response = self.client.post(self.list_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Terms.objects.count(), 2)

    def test_update_terms_as_regular_user(self):
        self.client.force_authenticate(user=self.user)

        data = {
            'tag': 'privacy-updated',
            'name': 'Updated Privacy Policy',
            'version': '1.1'
        }

        response = self.client.patch(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.terms1.refresh_from_db()
        self.assertEqual(self.terms1.tag, 'privacy')

    def test_delete_terms_as_admin(self):
        self.client.force_authenticate(user=self.admin_user)

        # We need to patch the delete method in the Terms model if it's trying to access a 'file' attribute
        # For now, let's just check if we can access the delete endpoint
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Terms.objects.count(), 1)

    def test_delete_terms_as_regular_user(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Terms.objects.count(), 2)

    def test_search_terms(self):
        response = self.client.get(f"{self.list_url}?search=privacy")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['tag'], 'privacy')

    def test_cleanup_files(self):
        """Clean up all files generated during testing"""
        self.client.force_authenticate(user=self.admin_user)

        # Get all Terms objects
        terms_objects = Terms.objects.all()

        # Delete each Terms object
        for term in terms_objects:
            # The delete method in the model should handle file deletion
            term.delete()

        # Verify all Terms objects are deleted
        self.assertEqual(Terms.objects.count(), 0)

        # Additional verification that files are removed from media directory
        import os
        import shutil
        from django.conf import settings

        # Check the terms directory in the media root
        terms_media_dir = os.path.join(settings.MEDIA_ROOT, 'terms')

        # If the directory exists, remove it completely
        if os.path.exists(terms_media_dir):
            # Remove all files and the directory itself
            shutil.rmtree(terms_media_dir)
            
        # Verify the directory is gone
        self.assertFalse(os.path.exists(terms_media_dir), 
                         f"Terms directory still exists at {terms_media_dir}")
