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

    def tearDown(self):
        # Delete all Terms objects and their associated files
        for term in Terms.objects.all():
            if term.content and hasattr(term.content, 'path') and os.path.isfile(term.content.path):
                try:
                    os.remove(term.content.path)
                except (FileNotFoundError, PermissionError) as e:
                    print(f"Error deleting file {term.content.path}: {e}")
            if term.pdf_content and hasattr(term.pdf_content, 'path') and os.path.isfile(term.pdf_content.path):
                try:
                    os.remove(term.pdf_content.path)
                except (FileNotFoundError, PermissionError) as e:
                    print(f"Error deleting file {term.pdf_content.path}: {e}")
            term.delete()

        # Clean up any remaining test files in the media directory
        terms_media_dir = os.path.join(settings.MEDIA_ROOT, 'terms')
        if os.path.exists(terms_media_dir):
            for filename in os.listdir(terms_media_dir):
                if 'test' in filename.lower() or 'update' in filename.lower():
                    try:
                        os.remove(os.path.join(terms_media_dir, filename))
                    except (FileNotFoundError, PermissionError) as e:
                        print(f"Error deleting file {filename}: {e}")
            try:
                os.rmdir(terms_media_dir)
            except OSError as e:
                print(f"Error removing directory {terms_media_dir}: {e}")
