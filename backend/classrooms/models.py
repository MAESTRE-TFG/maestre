from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from users.models import CustomUser
import re


class Classroom(models.Model):
    name = models.CharField(max_length=30)
    academic_course = models.CharField(max_length=30)
    description = models.TextField(max_length=255)
    academic_year = models.CharField(max_length=9, validators=[
        RegexValidator(
            regex=r'^\d{4}-\d{4}$',
            message='Academic year must be in the format YYYY-YYYY',
            code='invalid_academic_year'
        )
    ])
    creator = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='classrooms')

    def clean(self):
        if not self.academic_year:
            raise ValidationError({'academic_year': 'Academic year cannot be empty.'})
        if not re.match(r'^\d{4}-\d{4}$', self.academic_year):
            raise ValidationError({'academic_year': 'Academic year must be in the format YYYY-YYYY.'})

    @property
    def number_of_students(self):
        return self.students.count()

    class Meta:
        verbose_name = 'Classroom'
        verbose_name_plural = 'Classrooms'
        ordering = ['name']

    def __str__(self):
        return self.name
