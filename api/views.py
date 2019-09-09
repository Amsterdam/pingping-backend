from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from . import models, serializers, decorators
from django.db.models import OuterRef, Subquery, Value
from django.db.models import IntegerField, TextField
import json
import time
import base64


class UserViewSet(viewsets.ModelViewSet):
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer
    filterset_fields = ['user_key']

    @action(detail=False, methods=['GET'], name='Me')
    @decorators.action_auth_required
    def me(self, request, user, *args, **kwargs):
        trans = models.Transaction.objects.filter(
            user_user_key=user,
        ).last()
        return Response({
            **(self.serializer_class(user).data),
            'city_pings': trans.city_pings if trans else 0
        })

    @decorators.action_auth_required
    def delete(self, request, user, *args, **kwargs):
        user.delete()
        return Response({'detail': 'deleted'})


class AchivementViewSet(viewsets.ModelViewSet):
    queryset = models.Achivement.objects.all()
    serializer_class = serializers.AchivementSerializer
    filterset_fields = [
        'name',
        'city_points_value',
        'icon',
        'description'
    ]

    @decorators.action_auth_required
    def list(self, request, user, *args, **kwargs):

        achievements = self.queryset.annotate(
            user=Value(user.id, IntegerField()),
        )

        return Response(
            serializers.AchivementSerializer(
                achievements,
                many=True
            ).data
        )


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

    @decorators.action_auth_required
    def list(self, request, user, *args, **kwargs):

        rewards = self.queryset.annotate(
            user=Value(user.id, IntegerField()),
            base_url=Value(request.build_absolute_uri('/')[:-1], TextField())
        )

        return Response(
            serializers.RewardSerializer(
                rewards,
                many=True
            ).data
        )

    @action(detail=False, methods=['GET'], name='Validate')
    def validate(self, request, *args, **kwargs):
        uuid = request.GET.get('uuid', False)

        if not uuid:
            return Response({
                "error": "The parameter 'uuid' is required"
            }, status=400)

        rewarduser = models.RewardUser.objects.filter(uuid=uuid).first()

        if not rewarduser:
            return Response({
                "error": "The parameter 'uuid' is invalid"
            }, status=404)

        if rewarduser.validated:
            return Response({
                "error": "Reward already claimed"
            }, status=208)

        rewarduser.validated = True
        rewarduser.save()

        return Response({
            "message": "Valid Reward"
        }, status=200)


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
        ).annotate(
            complete=Subquery(
                models.TaskUser.objects.filter(
                    task=OuterRef('task'),
                    user_user_key=user
                ).values('id')[:1]
            )
        ).order_by('task__order')
        return Response(
            serializers.RouteTaskPreviewSerializer(
                route_tasks,
                many=True
            ).data
        )


class TaskViewSet(viewsets.ModelViewSet):
    queryset = models.Task.objects.all()
    serializer_class = serializers.TaskSerializer
    filterset_fields = [
        'name',
        'description',
        'city_points_value',
    ]

    @action(detail=True, methods=['Post'], name='Complete')
    @decorators.action_auth_required
    def complete(self, request, pk, user, *args, **kwargs):
        serial = serializers.TaskUserSerializer(data={
            **request.data,
            'status': 'Complete',
            'task': pk,
            'user_user_key': user.pk
        })
        if not serial.is_valid():
            return Response(serial.errors, status=400)

        return Response(
            serializers.TaskUserSerializer(serial.save()).data
        )


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

    @decorators.action_auth_required
    def create(self, request, user, *args, **kwargs):
        seria = serializers.GoalCreateSerializer(data={
            **request.data,
            'user_user_key': user.pk
        })
        if not seria.is_valid():
            return Response(seria.errors, status=400)
        return Response(
            serializers.GoalSerializer(
                seria.save(),
            ).data
        )

    @decorators.action_auth_required
    def list(self, request, user, *args, **kwargs):
        goals = self.queryset.filter(user_user_key=user)
        return Response(
            serializers.GoalSerializer(
                goals,
                many=True
            ).data
        )


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
        cookie = base64.b64encode(json.dumps({}).encode("utf-8"))
        return Response({
            'cookie': cookie,
            **(serializers.QuestionSerializer(next_question).data)
        })

    @action(detail=False, methods=['POST'], name='Default')
    def default(self, request, *args, **kwargs):
        task_list = models.Route.calculate({})
        return self.complete(task_list)

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

        if not ('cookie' in request.data):
            return Response({
                "error": "The key 'cookie' is required"
            }, status=400)

        temp_id = request.META.get('HTTP_TEMP_ID')
        question = get_object_or_404(models.Question, pk=pk)
        answer = request.data['answer']

        stored_data = base64.b64decode(request.data['cookie']).decode('utf-8')
        stored_dict = json.loads(stored_data) if stored_data else {}
        stored_dict[question.question] = answer
        coockie = base64.b64encode(json.dumps(stored_dict).encode("utf-8"))

        next_question = question.next(answer)

        if not next_question:
            task_list = models.Route.calculate(stored_dict)
            return self.complete(task_list)

        return Response({
            'cookie': coockie,
            **(serializers.QuestionSerializer(next_question).data)
        })

    def complete(self, task_list):
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

        register_achivments = models.Achivement.objects.filter(
            task__isnull=True,
            on_complete=False
        )
        for achivement in register_achivments:
            models.AchivementUser.objects.create(
                achivement=achivement,
                user_user_key=user_user_key
            )

        return Response(
            serializers.RouteShowSerializer(
                dict(
                    user_user_key=user_user_key,
                    tasks=json.dumps(tasks)
                )
            ).data
        )
