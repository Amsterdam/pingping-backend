from django.db import models
from django.db.models import Sum
from django.core.exceptions import ValidationError
import jsonfield
from datetime import date
from django.utils.html import escape
from django.utils.safestring import mark_safe
import re


class User(models.Model):
    user_key = models.BigIntegerField()

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
        error_message = 'The text must begin with " [ " , end with " ] " and each Task_ID must be separated by a hyphen " , ".'
        raise ValidationError(error_message)
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
    order = models.IntegerField(blank=True)

    def save(self, *args, **kwargs):
        if not self.pk:
            last = Task.objects.order_by('order').last()
            if last:
                self.order = last.order + 10
            else:
                self.order = 0
        super().save(*args, **kwargs)

    @staticmethod
    def match_all(tasks, conds):
        for task in tasks:
            if task.match(conds):
                return True
        return False

    def match(self, conds):
        if Task.match_all(self.tasks.all(), conds) or self.conditions.items() <= conds.items():
            return True
        return False

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


class Question(models.Model):
    STEP = 10
    YESNO = 'yesNo'
    DATE = 'date'
    YES = 'yes'
    NOT = 'not'

    question = models.CharField(max_length=255)
    question_icon = models.TextField(null=True, blank=True)
    type = models.CharField(
        max_length=5,
        choices=(
            (YESNO, 'Yes or No'),
            (DATE, 'Date')
        )
    )
    yes_text = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )
    yes_id = models.ForeignKey(
        'Question',
        related_name='q_yes_id',
        on_delete=models.PROTECT,
        null=True,
        blank=True
    )
    not_text = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )
    not_id = models.ForeignKey(
        'Question',
        related_name='q_not_id',
        on_delete=models.PROTECT,
        null=True,
        blank=True
    )
    order = models.IntegerField(blank=True)

    def image_tag(self):
        return mark_safe('<img height="24px" src="%s" />' % self.question_icon)

    image_tag.short_description = 'Question icon'
    image_tag.allow_tags = True

    def __str__(self):
        return self.question

    def save(self, *args, **kwargs):
        if not self.pk:
            last = Question.objects.order_by('order').last()
            if last:
                self.order = last.order + self.STEP
            else:
                self.order = 0
        super().save(*args, **kwargs)

    def next(self, response):
        if self.type == self.DATE:
            return Question.objects.filter(
                order=self.order + self.STEP
            ).first()
        elif self.type == self.YESNO:
            if response == self.YES:
                return self.yes_id
            elif response == self.NOT:
                return self.not_id
