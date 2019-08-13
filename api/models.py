from django.db import models
from django.db.models import Sum
import jsonfield


class User(models.Model):
    user_key = models.IntegerField()

    def __str__(self):
        return "%d" % self.user_key


class Achivement(models.Model):
    user_user_key = models.ForeignKey(User, on_delete=models.PROTECT)
    name = models.CharField(max_length=255)
    city_points_value = models.IntegerField()
    unlock_date = models.DateField()

    def __str__(self):
        return self.name


class Transaction(models.Model):
    user_user_key = models.ForeignKey(User, on_delete=models.PROTECT)
    city_pings = models.IntegerField()
    earnings = models.IntegerField()
    losts = models.IntegerField()

    def __str__(self):
        return "Transaction #%d" % self.id


class Reward(models.Model):
    user_user_key = models.ForeignKey(User, on_delete=models.PROTECT)
    name = models.CharField(max_length=255)
    cost = models.IntegerField()
    descritption = models.TextField(max_length=500)
    vendor = models.CharField(max_length=255)
    status = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Route(models.Model):
    user_user_key = models.ForeignKey(User, on_delete=models.PROTECT)
    tasks = models.TextField(max_length=255)
    city_points_value = models.IntegerField()

    @staticmethod
    def calculate(conds):
        tasks = Task.objects.order_by('order')
        return [x for x in tasks if not x.match(conds)]

    def __str__(self):
        return "Route #%d" % self.id


class Task(models.Model):
    user_user_key = models.ForeignKey(User, on_delete=models.PROTECT)
    name = models.CharField(max_length=255)
    descritption = models.TextField(max_length=500)
    status = models.CharField(max_length=100)
    tasks = models.ManyToManyField('Task', blank=True)
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


class Goal(models.Model):
    user_user_key = models.ForeignKey(User, on_delete=models.PROTECT)
    desired_amount = models.FloatField(max_length=10)
    title = models.CharField(max_length=255)
    descritption = models.TextField(max_length=500)
    category = models.CharField(max_length=255)

    def __str__(self):
        return "Goal #%d" % self.id
