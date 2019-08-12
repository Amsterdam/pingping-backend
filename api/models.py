from django.db import models


class User(models.Model):
    user_key = models.IntegerField()


class Achivement(models.Model):
    user_user_key = models.ForeignKey(User, on_delete=models.PROTECT)
    name = models.CharField(max_length=255)
    city_points_value = models.IntegerField()
    unlock_date = models.DateField()


class Transaction(models.Model):
    user_user_key = models.ForeignKey(User, on_delete=models.PROTECT)
    city_pings = models.IntegerField()
    earnings = models.IntegerField()
    losts = models.IntegerField()


class Reward(models.Model):
    user_user_key = models.ForeignKey(User, on_delete=models.PROTECT)
    name = models.CharField(max_length=255)
    cost = models.IntegerField()
    descritption = models.TextField(max_length=500)
    vendor = models.CharField(max_length=255)
    status = models.CharField(max_length=100)


class Route(models.Model):
    user_user_key = models.ForeignKey(User, on_delete=models.PROTECT)
    tasks = models.TextField(max_length=255)
    city_points_value = models.IntegerField()


class Task(models.Model):
    user_user_key = models.ForeignKey(User, on_delete=models.PROTECT)
    name = models.CharField(max_length=255)
    descritption = models.TextField(max_length=500)
    status = models.CharField(max_length=100)
    tasks = models.ManyToManyField('Task')


class Goal(models.Model):
    user_user_key = models.ForeignKey(User, on_delete=models.PROTECT)
    desired_amount = models.FloatField(max_length=10)
    title = models.CharField(max_length=255)
    descritption = models.TextField(max_length=500)
    category = models.CharField(max_length=255)
