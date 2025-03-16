from django.db import models
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError
import os


def validate_file_limit(classroom):
    if classroom.documents.count() >= 50:
        raise ValidationError('A classroom cannot have more than 3 files.')


class Document(models.Model):
    name = models.CharField(max_length=255)
    file = models.FileField(
        upload_to='documents/',
        validators=[
            FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx', 'png', 'jpg', 'pptx']),
        ]
    )
    classroom = models.ForeignKey(
        'classrooms.Classroom',
        on_delete=models.CASCADE,
        related_name='documents',
        validators=[validate_file_limit]
    )

    tags = models.ManyToManyField('tags.Tag', related_name='documents', blank=True)

    def __str__(self):
        return self.name

    def clean(self):
        if not self.pk:  # Only check on creation
            if self.classroom and self.classroom.documents.count() >= 50:
                raise ValidationError('A classroom cannot have more than 3 files.')
        super().clean()

    def delete(self, *args, **kwargs):
        # Delete the file from filesystem when model is deleted
        if self.file:
            if os.path.isfile(self.file.path):
                os.remove(self.file.path)
        super().delete(*args, **kwargs)
