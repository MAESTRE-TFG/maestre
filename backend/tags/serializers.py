from rest_framework import serializers
from .models import Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'color']
        read_only_fields = ['creator']

    def validate_color(self, value):
        if value and (len(value) != 7 or not value.startswith('#')):
            raise serializers.ValidationError('Invalid hexadecimal color code.')
        try:
            int(value[1:], 16)
        except ValueError:
            raise serializers.ValidationError('Invalid hexadecimal color code.')
        return value
