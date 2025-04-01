from django.db import models
from django.core.validators import FileExtensionValidator
import os
from django.core.exceptions import ValidationError
from django.conf import settings


class Terms(models.Model):
    TAG_CHOICES = [
        ('terms', 'Terms and Conditions of Use'),
        ('cookies', 'Cookie Policy'),
        ('privacy', 'Privacy Policy'),
        ('license', 'License'),
    ]

    name = models.CharField(max_length=127)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='authored_terms'
    )
    content = models.FileField(
        upload_to='terms/',
        validators=[
            FileExtensionValidator(allowed_extensions=['md']),
        ]
    )
    version = models.CharField(max_length=20)
    tag = models.CharField(max_length=20, choices=TAG_CHOICES, default='terms')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def clean(self):
        if not self.pk:  # Only check on creation
            # Check if there's already a document with the same tag
            existing_terms = Terms.objects.filter(tag=self.tag)
            if existing_terms.exists():
                raise ValidationError(f'A "{self.tag}" document already exists.')

        # Ensure the uploaded file is a valid markdown file
        if self.content:
            if not self.content.name.endswith('.md'):
                raise ValidationError("The content file must be a markdown (.md) file.")
            if hasattr(self.content.file, 'content_type') and self.content.file.content_type != "text/markdown":
                raise ValidationError("The uploaded file must have a valid markdown content type.")
        super().clean()

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Delete the file from filesystem when model is deleted
        if self.content:
            if os.path.isfile(self.content.path):
                os.remove(self.content.path)
        super().delete(*args, **kwargs)

    class Meta:
        verbose_name = "Term"
        verbose_name_plural = "Terms"
