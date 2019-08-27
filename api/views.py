from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from . import models, serializers, decorators
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
        'icon',
        'description'
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
        'title',
        'cost',
        'description',
        'vendor',
        'info',
        'success_m'
    ]

    @decorators.action_auth_required
    def retrieve(self, request, pk, user, *args, **kwargs):
        reward = get_object_or_404(models.Reward, pk=pk)
        reward.user = user
        return Response(
            serializers.RewardRetriveSerializer(
                reward,
            ).data
        )

    @action(detail=True, methods=['POST'], name='Claim')
    @decorators.action_auth_required
    def claim(self, request, pk, user, *args, **kwargs):
        reward = get_object_or_404(models.Reward, pk=pk)
        rewarduser = models.RewardUser.objects.create(
            reward=reward,
            user_user_key=user,
            status='Complete'
        )
        return Response(
            serializers.RewardUserSerializer(
                rewarduser,
            ).data
        )


class RewardUserViewSet(viewsets.ModelViewSet):
    queryset = models.RewardUser.objects.all()
    serializer_class = serializers.RewardUserSerializer
    filterset_fields = [
        'user_user_key',
        'reward',
        'status',
        'qr',
        'pdf'
    ]


class RouteViewSet(viewsets.ModelViewSet):
    queryset = models.Route.objects.all()
    serializer_class = serializers.RouteSerializer
    filterset_fields = [
        'user_user_key__user_key',
    ]

    @action(detail=False, methods=['GET'], name='Preview')
    @decorators.action_auth_required
    def preview(self, request, user, *args, **kwargs):
        route = get_object_or_404(models.Route, user_user_key=user)
        task_list = json.loads(route.tasks)
        route_tasks = models.RouteTask.objects.filter(
            task__id__in=task_list
        ).order_by('task__order')
        return Response(
            serializers.RouteTaskSerializer(
                route_tasks,
                many=True
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
        'media',
        'check_task'
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
        next_question = models.Question.objects.order_by('order').first()

        if not next_question:
            return Response({
                "message": "There are no questions"
            }, status=300)

        return Response(
            serializers.QuestionSerializer(next_question).data
        )

    @action(detail=True, methods=['OPTIONS', 'POST'], name='Next')
    def next(self, request, pk, *args, **kwargs):
        if not ('HTTP_TEMP_ID' in request.META):
            return Response({
                "error": "The header 'temp-id' is required"
            }, status=400)

        if not ('answer' in request.data):
            return Response({
                "error": "The key 'answer' is required"
            }, status=400)

        temp_id = request.META.get('HTTP_TEMP_ID')
        question = get_object_or_404(models.Question, pk=pk)
        answer = request.data['answer']

        stored_data = request.session.get(temp_id)
        stored_dict = json.load(stored_data) if stored_data else {}
        stored_dict[question.question] = answer
        request.session[temp_id] = json.dumps(stored_dict)

        next_question = question.next(answer)

        if not next_question:
            task_list = models.Route.calculate(stored_dict)
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

        return Response(
            serializers.QuestionSerializer(next_question).data
        )
