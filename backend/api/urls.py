from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ItemViewSet
from users.views import UserViewSet
from schools.views import SchoolListView, SchoolViewSet
from classrooms.views import ClassroomViewSet

router = DefaultRouter()
router.register(r'items', ItemViewSet)
router.register(r'users', UserViewSet)
router.register(r'schools', SchoolViewSet, basename='schools')
router.register(r'students', StudentViewSet, basename='students')
router.register(r'classrooms', ClassroomViewSet, basename='classroom')

urlpatterns = [
    path('', include(router.urls)),
    path('users/signup/', UserViewSet.as_view({'post': 'signup'})),
    path('users/signin/', UserViewSet.as_view({'post': 'signin'})),
    path('users/signout/', UserViewSet.as_view({'post': 'signout'})),
    path('users/<int:pk>/update/', UserViewSet.as_view({'put': 'update_user'})),
    path('users/<int:pk>/delete/', UserViewSet.as_view({'delete': 'delete_user'})),
    path('schools/', SchoolListView.as_view(), name='school-list'),
    path('schools/<int:pk>/', SchoolViewSet.as_view({'get': 'retrieve',
                                                     'put': 'update',
                                                     'patch': 'partial_update',
                                                     'delete': 'destroy'}), name='school-detail'),
    path('classrooms/<int:pk>/update/', ClassroomViewSet.as_view({'put': 'update'})),
    path('classrooms/<int:pk>/delete/', ClassroomViewSet.as_view({'delete': 'destroy'})),

]
