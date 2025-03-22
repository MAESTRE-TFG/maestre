from rest_framework import serializers
from .models import Terms


class TermsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Terms
        fields = ['id', 'tag', 'content', 'created_at', 'updated_at', 'author', 'name', 'version']
        read_only_fields = ['created_at', 'updated_at', 'author']
