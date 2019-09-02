from rest_framework import serializers
from . import models
import json


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
    qr = serializers.ReadOnlyField(source='qr_data')
    class Meta:
        model = models.RewardUser
        fields = [
            'user_user_key',
            'reward',
            'status',
            'validated',
            'qr'
        ]


class RewardSerializer(serializers.ModelSerializer):
    claimed = serializers.SerializerMethodField()

    def get_claimed(self, obj):
        if hasattr(obj, 'user'):
            rewarduser = models.RewardUser.objects.filter(
                reward=obj,
                user_user_key=obj.user
            ).first()
            if rewarduser:
                return RewardUserSerializer(rewarduser).data

    class Meta:
        model = models.Reward
        fields = [
            'id',
            'title',
            'cost',
            'description',
            'vendor',
            'info',
            'left',
            'success_m',
            'picture',
            'claimed'
        ]


class RewardRetriveSerializer(serializers.ModelSerializer):
    citypings = serializers.SerializerMethodField()
    claimed = serializers.SerializerMethodField()

    def get_citypings(self, obj):
        last_transaction = models.Transaction.objects.filter(
            user_user_key=obj.user
        ).last()
        if last_transaction:
            return last_transaction.city_pings

    def get_claimed(self, obj):
        return models.RewardUser.objects.filter(
            reward=obj,
            user_user_key=obj.user
        ).exists()

    class Meta:
        model = models.Reward
        fields = [
            'title',
            'cost',
            'description',
            'vendor',
            'citypings',
            'claimed',
            'left',
            'info',
            'success_m'
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
    steps = serializers.SerializerMethodField()

    def get_steps(self, obj):
        return obj.steps

    class Meta:
        model = models.Task
        fields = [
            'id',
            'name',
            'description',
            'city_points_value',
            'steps',
            'media',
            'check_task'
        ]


class RouteTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.RouteTask
        fields = [
            'title',
            'task',
            'brief_description',
            'card_description',
            'card_icon',
            'card_color',
            'info_b',
        ]


class RouteTaskPreviewSerializer(serializers.ModelSerializer):
    complete = serializers.ReadOnlyField()
    city_points_value = serializers.ReadOnlyField(
        source='task.city_points_value'
    )
    card_icon = serializers.ReadOnlyField(
        source='card_icon.image_data'
    )

    class Meta:
        model = models.RouteTask
        fields = [
            'task',
            'brief_description',
            'card_description',
            'card_icon',
            'info_b',
            'complete',
            'city_points_value'
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


class QuestionSerializer(serializers.ModelSerializer):
    questionIcon = serializers.ReadOnlyField(source='question_icon.image_data')
    questionType = serializers.ReadOnlyField(source='type')
    answer = serializers.SerializerMethodField()
    previousQuestion = serializers.SerializerMethodField()
    currentQuestion = serializers.ReadOnlyField(source='id')
    numberOfQuestions = serializers.SerializerMethodField()
    order = serializers.ReadOnlyField(source='get_order')

    def get_answer(self, obj):
        return {
            "yesText": obj.yes_text,
            "noText": obj.not_text
        }

    def get_previousQuestion(self, obj):
        prev = obj.prev()
        if prev:
            return prev.id

    def get_numberOfQuestions(self, obj):
        return models.Question.objects.count()

    class Meta:
        model = models.Question
        fields = [
            'id',
            'question',
            'questionIcon',
            'questionType',
            'answer',
            'previousQuestion',
            'currentQuestion',
            'numberOfQuestions',
            'order'
        ]
