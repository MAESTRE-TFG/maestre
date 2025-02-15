from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet
from users.views import UserViewSet
from schools.views import SchoolViewSet

router = DefaultRouter()
router.register(r'items', ItemViewSet)
router.register(r'users', UserViewSet)
router.register(r'schools', SchoolViewSet, basename='schools')

urlpatterns = [
    path('', include(router.urls)),
]