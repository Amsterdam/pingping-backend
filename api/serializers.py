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
            'name',
            'city_points_value',
        ]


class AchivementUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AchivementUser
        fields = [
            'achivement',
            'user_user_key',
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


class RewardUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.RewardUser
        fields = [
            'user_user_key',
            'reward',
            'status',
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


class RouteShowSerializer(serializers.ModelSerializer):
    user_user_key = UserSerializer()

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
            'city_points_value',
            'steps',
            'conditions',
        ]


class TaskUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TaskUser
        fields = [
            'user_user_key',
            'task',
            'status',
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
