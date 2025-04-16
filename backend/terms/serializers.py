from rest_framework import serializers
from .models import Terms


class TermsSerializer(serializers.ModelSerializer):
    tag_display = serializers.CharField(source='get_tag_display', read_only=True)

    class Meta:
        model = Terms
        fields = ['id', 'name', 'tag', 'tag_display', 'content', 'pdf_content',
                  'version', 'author', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at', 'author']
