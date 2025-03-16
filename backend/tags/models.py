from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Tag(models.Model):
    name = models.CharField(max_length=50)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    color = models.CharField(max_length=7, default='#808080', help_text='Hexadecimal color code (e.g. #FF0000)')

    class Meta:
        unique_together = ['name', 'creator']

    def __str__(self):
        return self.name
