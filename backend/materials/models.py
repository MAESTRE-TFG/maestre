from django.db import models
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError
from django.conf import settings
import os


def validate_file_limit(classroom):
    if classroom.documents.count() >= settings.MAX_FILES_PER_CLASSROOM:
        raise ValidationError(f'A classroom cannot have more than {settings.MAX_FILES_PER_CLASSROOM} files.')


def validate_file_size(value):
    limit = settings.MAX_FILE_SIZE * 1024 * 1024
    if value.size > limit:
        raise ValidationError(f'File size cannot exceed {settings.MAX_FILE_SIZE}MB.')


class Document(models.Model):
    name = models.CharField(max_length=50)
    file = models.FileField(
        upload_to='documents/',
        validators=[
            FileExtensionValidator(allowed_extensions=[
                'pdf', 'doc', 'docx', 'png', 'jpg', 'pptx', 'txt', 'md', 'tex', 'pages'
            ]),
            validate_file_size,
        ]
    )
    classroom = models.ForeignKey(
        'classrooms.Classroom',
        on_delete=models.CASCADE,
        related_name='documents',
    )

    tags = models.ManyToManyField('tags.Tag', related_name='documents', blank=True)

    def __str__(self):
        return self.name

    def clean(self):
        validate_file_limit(self.classroom)
        super().clean()

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Delete the file from filesystem when model is deleted
        if self.file:
            if os.path.isfile(self.file.path):
                os.remove(self.file.path)
        super().delete(*args, **kwargs)
