from django.db import models

# Create your models here.
class School(models.Model):
    # Enumerado con todas las provincias de España
    name = models.CharField(max_length=200)
    community = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    # Opción multiple de etapas educativas
    stages = models.TextField(max_length=500)

    class Meta:
        verbose_name = 'School'
        verbose_name_plural = 'Schools'
        ordering = ['name']
        
    def __str__(self):
        return self.name
