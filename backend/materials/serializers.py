from .models import Document
from rest_framework import serializers
from tags.serializers import TagSerializer
from rest_framework.exceptions import ValidationError
from tags.models import Tag

class DocumentSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.ListField(write_only=True, required=False)

    class Meta:
        model = Document
        fields = ['id', 'name', 'file', 'classroom', 'tags', 'tag_ids']

    def create(self, validated_data):
        tag_ids = validated_data.pop('tag_ids', [])
        document = Document.objects.create(**validated_data)
        document.tags.set(tag_ids)
        return document

    def validate_tag_ids(self, value):
        if not isinstance(value, list):
            raise ValidationError("tag_ids must be a list.")
        for tag_id in value:
            if not isinstance(tag_id, int):
                raise ValidationError(f"Invalid tag ID: {tag_id}. Must be an integer.")
            if not Tag.objects.filter(id=tag_id).exists():
                raise ValidationError(f"Tag with ID {tag_id} does not exist.")
        return value

    def update(self, instance, validated_data):
        tag_ids = validated_data.pop('tag_ids', None)
        if tag_ids is not None:
            instance.tags.set(tag_ids)
        return super().update(instance, validated_data)
