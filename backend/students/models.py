from django.db import models
from django.core.exceptions import ValidationError
from django.conf import settings
from classrooms.models import Classroom


def validate_student_limit(classroom):
    if classroom.students.count() >= settings.MAX_STUDENTS_PER_CLASSROOM:
        raise ValidationError(f'A classroom cannot have more than {settings.MAX_STUDENTS_PER_CLASSROOM} students.')


class Student(models.Model):
    name = models.CharField(max_length=30)
    surname = models.CharField(max_length=30)
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='students')

    def clean(self):
        validate_student_limit(self.classroom)
        super().clean()

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
