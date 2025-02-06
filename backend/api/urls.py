from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, UserViewSet

router = DefaultRouter()
router.register(r'items', ItemViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
]