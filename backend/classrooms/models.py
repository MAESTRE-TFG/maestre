from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from users.models import CustomUser
from django.conf import settings
import re


def validate_classroom_limit(user):
    if user.classrooms.count() >= settings.MAX_CLASSROOMS_PER_TEACHER:
        raise ValidationError(f'A teacher cannot have more than {settings.MAX_CLASSROOMS_PER_TEACHER} classrooms.')


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
        super().clean()
        if self.academic_year:
            try:
                start_year, end_year = map(int, self.academic_year.split('-'))
                if end_year != start_year + 1:
                    raise ValidationError({
                        'academic_year': 'Academic years must be consecutive (e.g., 2024-2025).'
                    })
                if end_year <= start_year:
                    raise ValidationError({
                        'academic_year': 'End year must be greater than start year.'
                    })
            except ValueError:
                raise ValidationError({
                    'academic_year': 'Academic year must be in the format YYYY-YYYY.'
                })
        if not self.academic_year:
            raise ValidationError({'academic_year': 'Academic year cannot be empty.'})

        if not re.match(r'^\d{4}-\d{4}$', self.academic_year):
            raise ValidationError({'academic_year': 'Academic year must be in the format YYYY-YYYY.'})
        validate_classroom_limit(self.creator)

    @property
    def number_of_students(self):
        return self.students.count()

    class Meta:
        verbose_name = 'Classroom'
        verbose_name_plural = 'Classrooms'
        ordering = ['name']

    def __str__(self):
        return self.name
