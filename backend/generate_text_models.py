import os
import django
from django.apps import apps

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Get all models from the apps we're interested in
app_labels = ['users', 'schools', 'students', 'classrooms', 'tags', 'materials', 'terms']

# Open a file to write the PlantUML model information with UTF-8 encoding
with open('maestre_models.puml', 'w', encoding='utf-8') as f:
    f.write("@startuml Maestre Project Models\n\n")
    
    # First define all classes
    for app_label in app_labels:
        f.write(f"' {app_label.upper()} APP\n")
        app_models = apps.get_app_config(app_label).get_models()
        
        for model in app_models:
            model_name = model.__name__
            f.write(f"class {model_name} {{\n")
            
            # Add fields
            for field in model._meta.fields:
                field_type = type(field).__name__
                f.write(f"  +{field.name}: {field_type}\n")
            
            f.write("}\n\n")
    
    f.write("' Relationships\n")
    
    # Now define all relationships
    for app_label in app_labels:
        app_models = apps.get_app_config(app_label).get_models()
        
        for model in app_models:
            model_name = model.__name__
            
            # Foreign key relationships
            for field in model._meta.fields:
                if field.remote_field and field.remote_field.model:
                    related_model = field.remote_field.model.__name__
                    f.write(f"{related_model} \"1\" -- \"*\" {model_name} : {field.name}\n")
            
            # Many-to-many relationships
            for field in model._meta.many_to_many:
                related_model = field.remote_field.model.__name__
                f.write(f"{model_name} \"*\" -- \"*\" {related_model} : {field.name}\n")
    
    f.write("\n@enduml")

print("PlantUML model diagram generated successfully in 'maestre_models.puml'")