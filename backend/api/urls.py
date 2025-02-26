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
    path('users/signup/', UserViewSet.as_view({'post': 'signup'})),
    path('users/signin/', UserViewSet.as_view({'post': 'signin'})),
    path('users/signout/', UserViewSet.as_view({'post': 'signout'})),
    path('users/<int:pk>/update/', UserViewSet.as_view({'put': 'update_user'})),
    path('users/<int:pk>/delete/', UserViewSet.as_view({'delete': 'delete_user'})),
]
