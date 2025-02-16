from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet
from users.views import UserViewSet

router = DefaultRouter()
router.register(r'items', ItemViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('users/signup/', UserViewSet.as_view({'post': 'signup'})),
    path('users/signin/', UserViewSet.as_view({'post': 'signin'})),
    path('users/signout/', UserViewSet.as_view({'post': 'signout'})),
    path('users/update/', UserViewSet.as_view({'put': 'update'})),
    path('users/delete/', UserViewSet.as_view({'delete': 'destroy'})),
]