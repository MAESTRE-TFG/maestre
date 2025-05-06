from django.test import TestCase
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from .models import Terms
from .serializers import TermsSerializer
from users.models import CustomUser
from schools.models import School
import os
import shutil
from django.conf import settings


class TermsModelTests(TestCase):

    def setUp(self):
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

        # Create markdown and PDF files for testing
        self.content_file = SimpleUploadedFile(
            "privacy_policy.md",
            b"Privacy policy content",
            content_type="text/markdown"
        )
        self.pdf_file = SimpleUploadedFile(
            "privacy_policy.pdf",
            b"%PDF-1.4\n%Test PDF content",
            content_type="application/pdf"
        )

        # Create a Terms instance with both content and pdf_content
        self.terms = Terms.objects.create(
            tag='privacy',
            content=self.content_file,
            pdf_content=self.pdf_file,  # Include the PDF file
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

        # Create markdown and PDF files for testing
        self.content_file = SimpleUploadedFile(
            "privacy_policy.md",
            b"Privacy policy content",
            content_type="text/markdown"
        )
        self.pdf_file = SimpleUploadedFile(
            "privacy_policy.pdf",
            b"%PDF-1.4\n%Test PDF content",
            content_type="application/pdf"
        )

        # Create the Terms instance with all required fields
        self.terms_attributes = {
            'tag': 'privacy',
            'name': 'Privacy Policy',
            'version': '1.0',
            'content': self.content_file,
            'pdf_content': self.pdf_file,  # Include the PDF file
        }

        self.terms = Terms.objects.create(
            **self.terms_attributes,
            author=self.admin_user
        )

        self.serializer = TermsSerializer(instance=self.terms)

    def test_terms_str_method(self):
        self.assertEqual(str(self.terms), self.terms.name)

    def test_contains_expected_fields(self):
        data = self.serializer.data
        expected_fields = {
            'id', 'tag', 'tag_display', 'content', 'pdf_content',  # Include 'tag_display' and 'pdf_content'
            'created_at', 'updated_at', 'author', 'name', 'version'
        }
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

        # Create markdown and PDF files for testing
        self.content_file1 = SimpleUploadedFile(
            "privacy_policy.md",
            b"Privacy policy content",
            content_type="text/markdown"
        )
        self.pdf_file1 = SimpleUploadedFile(
            "privacy_policy.pdf",
            b"%PDF-1.4\n%Test PDF content",
            content_type="application/pdf"
        )

        self.terms1 = Terms.objects.create(
            tag='privacy',
            content=self.content_file1,
            pdf_content=self.pdf_file1,
            name='Privacy Policy',
            version='1.0',
            author=self.admin_user
        )

        self.content_file2 = SimpleUploadedFile(
            "terms_of_service.md",
            b"Terms of service content",
            content_type="text/markdown"
        )
        self.pdf_file2 = SimpleUploadedFile(
            "terms_of_service.pdf",
            b"%PDF-1.4\n%Test PDF content",
            content_type="application/pdf"
        )

        self.terms2 = Terms.objects.create(
            tag='terms',
            content=self.content_file2,
            pdf_content=self.pdf_file2,
            name='Terms of Service',
            version='1.0',
            author=self.admin_user
        )

        # URLs for ViewSet
        self.list_url = reverse('terms-list')
        self.detail_url = reverse('terms-detail', kwargs={'pk': self.terms1.pk})



class TermsViewSetTests(APITestCase):
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

        # Authenticate as admin user
        self.client.force_authenticate(user=self.admin_user)

        # Create markdown and PDF files for testing
        self.content_file1 = SimpleUploadedFile(
            "privacy_policy.md",
            b"Privacy policy content",
            content_type="text/markdown"
        )
        self.pdf_file1 = SimpleUploadedFile(
            "privacy_policy.pdf",
            b"%PDF-1.4\n%Test PDF content",
            content_type="application/pdf"
        )

        self.terms1 = Terms.objects.create(
            tag='privacy',
            content=self.content_file1,
            pdf_content=self.pdf_file1,
            name='Privacy Policy',
            version='1.0',
            author=self.admin_user
        )

        self.content_file2 = SimpleUploadedFile(
            "terms_of_service.md",
            b"Terms of service content",
            content_type="text/markdown"
        )
        self.pdf_file2 = SimpleUploadedFile(
            "terms_of_service.pdf",
            b"%PDF-1.4\n%Test PDF content",
            content_type="application/pdf"
        )

        self.terms2 = Terms.objects.create(
            tag='terms',
            content=self.content_file2,
            pdf_content=self.pdf_file2,
            name='Terms of Service',
            version='1.0',
            author=self.admin_user
        )

        # URLs for ViewSet
        self.list_url = reverse('terms-list')
        self.detail_url = reverse('terms-detail', kwargs={'pk': self.terms1.pk})

    # ---------------- Positive Test Cases ----------------

    def test_list_terms(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_retrieve_terms(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.terms1.name)

    def test_create_terms(self):
        content_file = SimpleUploadedFile(
            "new_terms.md",
            b"New terms content",
            content_type="text/markdown"
        )
        pdf_file = SimpleUploadedFile(
            "new_terms.pdf",
            b"%PDF-1.4\n%New PDF content",
            content_type="application/pdf"
        )
        data = {
            'tag': 'license',
            'name': 'License Agreement',
            'version': '1.0',
            'content': content_file,
            'pdf_content': pdf_file
        }
        response = self.client.post(self.list_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Terms.objects.count(), 3)

    def test_update_terms(self):
        data = {'name': 'Updated Privacy Policy'}
        response = self.client.patch(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.terms1.refresh_from_db()
        self.assertEqual(self.terms1.name, 'Updated Privacy Policy')

    def test_delete_terms(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Terms.objects.count(), 1)

    # ---------------- Negative Test Cases ----------------

    def test_create_terms_duplicate_tag(self):
        data = {
            'tag': 'privacy',
            'name': 'Duplicate Privacy Policy',
            'version': '1.0',
            'content': self.content_file1,
            'pdf_content': self.pdf_file1
        }
        response = self.client.post(self.list_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('tag', response.data)

    def test_create_terms_invalid_file_type(self):
        invalid_file = SimpleUploadedFile(
            "invalid_file.txt",
            b"Invalid file content",
            content_type="text/plain"
        )
        data = {
            'tag': 'license',
            'name': 'Invalid File Terms',
            'version': '1.0',
            'content': invalid_file,
            'pdf_content': self.pdf_file1
        }
        response = self.client.post(self.list_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_nonexistent_terms(self):
        response = self.client.get(reverse('terms-detail', kwargs={'pk': 999}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_terms_unauthenticated(self):
        self.client.force_authenticate(user=None)
        data = {'name': 'Unauthorized Update'}
        response = self.client.patch(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_terms_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_terms_with_filter(self):
        response = self.client.get(self.list_url, {'tag': 'privacy'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['tag'], 'privacy')


    def tearDown(self):
        # List of files to exclude from deletion
        excluded_files = {'terms.pdf', 'terms.md', 'cookies.pdf', 'cookies.md', 'privacy.pdf', 'privacy.md'}

        # Delete all Terms objects and their associated files
        for term in Terms.objects.all():
            if term.content and hasattr(term.content, 'path') and os.path.isfile(term.content.path):
                if os.path.basename(term.content.path) not in excluded_files:
                    try:
                        os.remove(term.content.path)
                    except (FileNotFoundError, PermissionError) as e:
                        print(f"Error deleting file {term.content.path}: {e}")
            if term.pdf_content and hasattr(term.pdf_content, 'path') and os.path.isfile(term.pdf_content.path):
                if os.path.basename(term.pdf_content.path) not in excluded_files:
                    try:
                        os.remove(term.pdf_content.path)
                    except (FileNotFoundError, PermissionError) as e:
                        print(f"Error deleting file {term.pdf_content.path}: {e}")
            term.delete()

        # Clean up any remaining test files in the media directory
        terms_media_dir = os.path.join(settings.MEDIA_ROOT, 'terms')
        if os.path.exists(terms_media_dir):
            shutil.rmtree(terms_media_dir)