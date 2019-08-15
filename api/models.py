from django.db import models
from django.db.models import Sum
from django.core.exceptions import ValidationError
import jsonfield
import re
from datetime import date


class User(models.Model):
    user_key = models.IntegerField()

    def __str__(self):
        return "%d" % self.user_key


class Transaction(models.Model):
    user_user_key = models.ForeignKey(User, on_delete=models.PROTECT)
    description = models.TextField()
    city_pings = models.IntegerField()
    earnings = models.IntegerField()
    losts = models.IntegerField()

    def __str__(self):
        return "Transaction #%d" % self.id


class Reward(models.Model):
    name = models.CharField(max_length=255)
    cost = models.IntegerField()
    description = models.TextField(max_length=500)
    vendor = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class RewardUser(models.Model):
    user_user_key = models.ForeignKey(User, on_delete=models.PROTECT)
    reward = models.ForeignKey(Reward, on_delete=models.PROTECT)
    status = models.CharField(max_length=100)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        last_trans = Transaction.objects.filter(
            user_user_key=self.user_user_key
        ).last()
        last_citi_pings = last_trans.city_pings if last_trans else 0
        Transaction.objects.create(
            user_user_key=self.user_user_key,
            description="Get reword %s" % self.reward.name,
            earnings=0,
            city_pings=last_citi_pings - self.reward.cost,
            losts=self.reward.cost
        )


def validate_tasks(value):
    if not re.match(r'^\[\]|\[(\s*\d+\s*\,)*\s*\d+\s*\]$', value):
        raise ValidationError('The text must begin with " [ " , end with " ] " and each Task_ID must be separated by a hyphen " , ".')
    return value


class Route(models.Model):
    user_user_key = models.ForeignKey(User, on_delete=models.PROTECT)
    tasks = models.TextField(max_length=255, validators=[validate_tasks])

    @staticmethod
    def calculate(conds):
        tasks = Task.objects.order_by('order')
        return [x for x in tasks if not x.match(conds)]

    def __str__(self):
        return "Route #%d" % self.id


class Task(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    city_points_value = models.IntegerField()
    tasks = models.ManyToManyField('Task', blank=True)
    steps = jsonfield.JSONField()
    conditions = jsonfield.JSONField()
    order = models.IntegerField(default=1)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        order = self.tasks.all().aggregate(order=Sum('order'))['order']
        if order:
            self.order = order + 1
            super().save(*args, **kwargs)

    def match(self, conds):
        for key in self.conditions.keys():
            if not (key in conds) or (self.conditions[key] != conds[key]):
                return False
        return True

    def __str__(self):
        return self.name


class TaskUser(models.Model):
    user_user_key = models.ForeignKey(User, on_delete=models.PROTECT)
    task = models.ForeignKey(Task, on_delete=models.PROTECT)
    status = models.CharField(max_length=100)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        achiv = Achivement.objects.filter(task=self.task).first()
        if achiv:
            AchivementUser.objects.create(
                achivement=achiv,
                user_user_key=self.user_user_key,
                unlock_date=date.today()
            )


class Achivement(models.Model):
    name = models.CharField(max_length=255)
    city_points_value = models.IntegerField()
    task = models.ForeignKey(
        Task,
        blank=True,
        null=True,
        on_delete=models.PROTECT
    )

    def __str__(self):
        return self.name


class AchivementUser(models.Model):
    user_user_key = models.ForeignKey(User, on_delete=models.PROTECT)
    achivement = models.ForeignKey(Achivement, on_delete=models.PROTECT)
    unlock_date = models.DateField()

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        last_trans = Transaction.objects.filter(
            user_user_key=self.user_user_key
        ).last()
        last_citi_pings = last_trans.city_pings if last_trans else 0
        Transaction.objects.create(
            user_user_key=self.user_user_key,
            description="Get achivement %s" % self.achivement.name,
            earnings=self.achivement.city_points_value,
            city_pings=last_citi_pings + self.achivement.city_points_value,
            losts=0
        )


class Goal(models.Model):
    user_user_key = models.ForeignKey(User, on_delete=models.PROTECT)
    desired_amount = models.FloatField(max_length=10)
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    category = models.CharField(max_length=255)

    def __str__(self):
        return "Goal #%d" % self.id
