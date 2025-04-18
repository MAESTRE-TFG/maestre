# Generated by Django 4.2.18 on 2025-04-12 12:05

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('materials', '0006_merge_20250317_1713'),
    ]

    operations = [
        migrations.AlterField(
            model_name='document',
            name='file',
            field=models.FileField(upload_to='documents/', validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx', 'png', 'jpg', 'pptx', 'txt', 'md', 'tex'])]),
        ),
        migrations.AlterField(
            model_name='document',
            name='name',
            field=models.CharField(max_length=30),
        ),
    ]
