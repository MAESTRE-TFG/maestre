from django.db import models


class School(models.Model):
    name = models.CharField(max_length=50)
    community = models.CharField(max_length=50)
    city = models.CharField(max_length=50)
    stages = models.TextField(max_length=100)

    class Meta:
        verbose_name = 'School'
        verbose_name_plural = 'Schools'
        ordering = ['name']

    def __str__(self):
        return self.name
