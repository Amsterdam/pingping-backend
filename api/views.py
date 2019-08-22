from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from . import models, serializers
import json
import time


class UserViewSet(viewsets.ModelViewSet):
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer
    filterset_fields = ['user_key']


class AchivementViewSet(viewsets.ModelViewSet):
    queryset = models.Achivement.objects.all()
    serializer_class = serializers.AchivementSerializer
    filterset_fields = [
        'name',
        'city_points_value',
    ]


class AchivementUserViewSet(viewsets.ModelViewSet):
    queryset = models.AchivementUser.objects.all()
    serializer_class = serializers.AchivementUserSerializer
    filterset_fields = [
        'achivement',
        'user_user_key',
        'unlock_date',
    ]


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = models.Transaction.objects.all()
    serializer_class = serializers.TransactionSerializer
    filterset_fields = [
        'user_user_key',
        'city_pings',
        'earnings',
        'losts',
    ]


class RewardViewSet(viewsets.ModelViewSet):
    queryset = models.Reward.objects.all()
    serializer_class = serializers.RewardSerializer
    filterset_fields = [
        'name',
        'cost',
        'descritption',
        'vendor',
    ]


class RewardUserViewSet(viewsets.ModelViewSet):
    queryset = models.RewardUser.objects.all()
    serializer_class = serializers.RewardUserSerializer
    filterset_fields = [
        'user_user_key',
        'reward',
        'status',
    ]


class RouteViewSet(viewsets.ModelViewSet):
    queryset = models.Route.objects.all()
    serializer_class = serializers.RouteSerializer
    filterset_fields = [
        'user_user_key__user_key',
    ]

    @action(detail=False, methods=['POST'], name='Calculate preview')
    def calculate_preview(self, request, *args, **kwargs):
        return Response(
            serializers.TaskSerializer(
                models.Route.calculate(json.loads(
                    request.data['tasks']
                )), many=True
            ).data
        )

    @action(detail=False, methods=['POST'], name='Calculate')
    def calculate(self, request, *args, **kwargs):
        task_list = models.Route.calculate(request.data)
        tasks = [x.id for x in task_list]
        user_user_key = models.User.objects.create(
            user_key=int(round(time.time() * 1000))
        )

        seria = serializers.RouteSerializer(
            data=dict(
                user_user_key=user_user_key.id,
                tasks=json.dumps(tasks)
            )
        )
        if not seria.is_valid():
            return Response(seria.errors, status=400)
        seria.save()
        return Response(
            serializers.RouteShowSerializer(
                dict(
                    user_user_key=user_user_key,
                    tasks=json.dumps(tasks)
                )
            ).data
        )


class TaskViewSet(viewsets.ModelViewSet):
    queryset = models.Task.objects.all()
    serializer_class = serializers.TaskSerializer
    filterset_fields = [
        'name',
        'descritption',
        'city_points_value',
        'steps',
        'conditions',
    ]


class TaskUserViewSet(viewsets.ModelViewSet):
    queryset = models.TaskUser.objects.all()
    serializer_class = serializers.TaskUserSerializer
    filterset_fields = [
        'user_user_key',
        'task',
        'status',
    ]


class GoalViewSet(viewsets.ModelViewSet):
    queryset = models.Goal.objects.all()
    serializer_class = serializers.GoalSerializer
    filterset_fields = [
        'user_user_key',
        'desired_amount',
        'title',
        'descritption',
    ]


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = models.Question.objects.all()
    serializer_class = serializers.QuestionSerializer
    filterset_fields = [
        'id',
        'question',
        'type',
        'yes_text',
        'not_text',
        'order',
    ]

    @action(detail=False, methods=['GET'], name='First')
    def first(self, request, *args, **kwargs):
        if request.method == 'GET':
            next_question = models.Question.objects.order_by('order').first()
        return Response({
            "question": next_question.question,
            "questionIcon": next_question.question_icon,
            "questionType": next_question.type,
            "answers": {
                "yesText": next_question.yes_text,
                "noText": next_question.not_text
            },
            "previousQuestion": None,
            "currentQuestion": next_question.pk,
            "numberOfQuestions": models.Question.objects.count()
        })

    @action(detail=True, methods=['POST'], name='Next')
    def next(self, request, pk, *args, **kwargs):
        question = models.Question.objects.get(pk=pk)
        next_question = question.next(request.data['answer'])
        if not next_question:
            return Response({"error": "Response not configured"})
        return Response({
            "question": next_question.question,
            "questionIcon": next_question.question_icon,
            "questionType": next_question.type,
            "answers": {
                "yesText": next_question.yes_text,
                "noText": next_question.not_text
            },
            "previousQuestion": pk,
            "currentQuestion": next_question.pk,
            "numberOfQuestions": models.Question.objects.count()
        })
