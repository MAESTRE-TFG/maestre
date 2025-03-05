from django.db import models
from django.core.validators import FileExtensionValidator
from classrooms.models import Classroom

class Document(models.Model):
    name = models.CharField(max_length=255)
    file = models.FileField(
        upload_to='documents/',
        validators=[FileExtensionValidator(allowed_extensions=['pdf'])]
    )
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='documents')

    def __str__(self):
        return self.name