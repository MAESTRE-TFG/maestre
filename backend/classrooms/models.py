from django.db import models
from django.core.validators import RegexValidator
from users.models import CustomUser


class Classroom(models.Model):
    name = models.CharField(max_length=100)
    academic_course = models.CharField(max_length=50)
    description = models.TextField(max_length=500)
    academic_year = models.CharField(max_length=9, validators=[
        RegexValidator(
            regex=r'^\d{4}-\d{4}$',
            message='Academic year must be in the format YYYY-YYYY',
            code='invalid_academic_year'
        )
    ])
    creator = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='classrooms')

    @property
    def number_of_students(self):
        return self.students.count()

    class Meta:
        verbose_name = 'Classroom'
        verbose_name_plural = 'Classrooms'
        ordering = ['name']

    def __str__(self):
        return self.name
