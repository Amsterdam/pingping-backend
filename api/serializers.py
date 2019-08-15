from rest_framework import serializers
from . import models


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = [
            'user_key',
        ]


class AchivementSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Achivement
        fields = [
            'user_user_key',
            'name',
            'city_points_value',
            'unlock_date',
        ]


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Transaction
        fields = [
            'user_user_key',
            'city_pings',
            'earnings',
            'losts',
        ]


class RewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Reward
        fields = [
            'user_user_key',
            'name',
            'cost',
            'descritption',
            'vendor',
            'status',
        ]


class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Route
        fields = [
            'user_user_key',
            'tasks',
        ]


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Task
        fields = [
            'name',
            'descritption',
            'status',
            'tasks'
        ]


class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Goal
        fields = [
            'user_user_key',
            'desired_amount',
            'title',
            'descritption',
            'category',
        ]
