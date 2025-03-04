from django.db import models


class School(models.Model):
    name = models.CharField(max_length=200)
    community = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    stages = models.TextField(max_length=500)

    class Meta:
        verbose_name = 'School'
        verbose_name_plural = 'Schools'
        ordering = ['name']

    def __str__(self):
        return self.name
