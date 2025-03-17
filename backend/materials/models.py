from django.db import models
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError
from classrooms.models import Classroom
import os

def validate_file_limit(classroom):
    if classroom.documents.count() >= 5:
        raise ValidationError('A classroom cannot have more than 5 files.')

class Document(models.Model):
    name = models.CharField(max_length=255)
    file = models.FileField(
        upload_to='documents/',
        validators=[
            FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx', 'png', 'jpg', 'pptx']),
        ]
    )
    classroom = models.ForeignKey(
        Classroom, 
        on_delete=models.CASCADE, 
        related_name='documents',
    )

    def clean(self):
        if not self.pk:  # Only check on creation
            validate_file_limit(self.classroom)
        super().clean()

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    def delete(self, *args, **kwargs):
        # Delete the file from filesystem when model is deleted
        if self.file:
            if os.path.isfile(self.file.path):
                os.remove(self.file.path)
        super().delete(*args, **kwargs)