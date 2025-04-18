# Generated by Django 4.2.18 on 2025-03-22 20:56

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Terms',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=127)),
                ('content', models.FileField(upload_to='terms/', validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['md'])])),
                ('version', models.CharField(max_length=20)),
                ('tag', models.CharField(choices=[('terms', 'Terms of Use'), ('cookies', 'Cookie Policy'), ('privacy', 'Privacy Policy'), ('license', 'License')], default='terms', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('author', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='authored_terms', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Term',
                'verbose_name_plural': 'Terms',
            },
        ),
    ]
