from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
import re
from django.conf import settings


User = get_user_model()


def validate_user_tags_limit(user):
    if user.tag_set.count() >= settings.MAX_TAGS:
        raise ValidationError(f'You can only create up to {settings.MAX_TAGS} tags.')


def validate_document_tags_limit(document):
    if document.tags.count() >= settings.MAX_TAGS_PER_FILE:
        raise ValidationError(f'A document can only have up to {settings.MAX_TAGS_PER_FILE} tags.')


class Tag(models.Model):
    name = models.CharField(max_length=50)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    color = models.CharField(max_length=7, default='#808080', help_text='Hexadecimal color code (e.g. #FF0000)')

    class Meta:
        unique_together = ['name', 'creator']

    def clean(self):
        validate_user_tags_limit(self.creator)

        # Validate color as a valid hexadecimal color code
        if self.color and not re.match(r'^#[0-9A-Fa-f]{6}$', self.color):
            raise ValidationError({'color': 'Invalid hexadecimal color code.'})

        # Ensure uniqueness of name for the creator
        if Tag.objects.filter(name=self.name, creator=self.creator).exclude(id=self.id).exists():
            raise ValidationError({'name': 'Tag with this Name and Creator already exists.'})

        super().clean()

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
