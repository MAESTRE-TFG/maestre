from .models import Document
from rest_framework import serializers
from tags.serializers import TagSerializer


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

    def update(self, instance, validated_data):
        tag_ids = validated_data.pop('tag_ids', None)
        if tag_ids is not None:
            instance.tags.set(tag_ids)
        return super().update(instance, validated_data)
