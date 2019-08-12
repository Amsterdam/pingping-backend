from django.shortcuts import render
from rest_framework import viewsets
from . import models, serializers


class UserViewSet(viewsets.ModelViewSet):
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer


class AchivementViewSet(viewsets.ModelViewSet):
    queryset = models.Achivement.objects.all()
    serializer_class = serializers.AchivementSerializer


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = models.Transaction.objects.all()
    serializer_class = serializers.TransactionSerializer


class RewardViewSet(viewsets.ModelViewSet):
    queryset = models.Reward.objects.all()
    serializer_class = serializers.RewardSerializer


class RouteViewSet(viewsets.ModelViewSet):
    queryset = models.Route.objects.all()
    serializer_class = serializers.RouteSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = models.Task.objects.all()
    serializer_class = serializers.TaskSerializer


class GoalViewSet(viewsets.ModelViewSet):
    queryset = models.Goal.objects.all()
    serializer_class = serializers.GoalSerializer
