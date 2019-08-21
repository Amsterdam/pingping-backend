from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'user', views.UserViewSet)
router.register(r'achivement', views.AchivementViewSet)
router.register(r'achivementuser', views.AchivementUserViewSet)
router.register(r'transaction', views.TransactionViewSet)
router.register(r'reward', views.RewardViewSet)
router.register(r'route', views.RouteViewSet)
router.register(r'task', views.TaskViewSet)
router.register(r'taskuser', views.TaskUserViewSet)
router.register(r'goal', views.GoalViewSet)
router.register(r'question', views.QuestionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
