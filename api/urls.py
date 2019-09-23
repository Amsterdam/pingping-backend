from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from django.http import HttpResponse
from . import views

router = routers.DefaultRouter()
router.register(r'user', views.UserViewSet)
router.register(r'achievement', views.AchivementViewSet)
router.register(r'achievementuser', views.AchivementUserViewSet)
router.register(r'transaction', views.TransactionViewSet)
router.register(r'reward', views.RewardViewSet)
router.register(r'rewarduser', views.RewardUserViewSet)
router.register(r'route', views.RouteViewSet)
router.register(r'task', views.TaskViewSet)
router.register(r'taskuser', views.TaskUserViewSet)
router.register(r'goal', views.GoalViewSet)
router.register(r'question', views.QuestionViewSet)

def status_health(request):
    return HttpResponse('OK', status=200)

urlpatterns = [
    path('', include(router.urls)),
    path('status/health', status_health)
]
