from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class CustomUser(AbstractUser):
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    region = models.CharField(max_length=100, null=True, blank=True, default=None)
    city = models.CharField(max_length=100, null=True, blank=True, default=None)
    school = models.CharField(max_length=200, null=True, blank=True, default=None)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    class Meta:
        ordering = ['username']

    def __str__(self):
        return f"{self.name} {self.surname} ({self.username})"