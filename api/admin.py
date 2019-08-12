from django.contrib import admin
from . import models


class UserAdmin(admin.ModelAdmin):
    pass


class AchivementAdmin(admin.ModelAdmin):
    list_display = [
        'user_user_key',
        'name',
        'city_points_value',
        'unlock_date',
    ]


class TransactionAdmin(admin.ModelAdmin):
    list_display = [
        'user_user_key',
        'city_pings',
        'earnings',
        'losts',
    ]


class RewardAdmin(admin.ModelAdmin):
    list_display = [
        'user_user_key',
        'name',
        'cost',
        'descritption',
        'vendor',
        'status',
    ]


class RouteAdmin(admin.ModelAdmin):
    list_display = [
        'user_user_key',
        'tasks',
        'city_points_value',
    ]


class TaskAdmin(admin.ModelAdmin):
    list_display = [
        'user_user_key',
        'name',
        'descritption',
        'status',
    ]


class GoalAdmin(admin.ModelAdmin):
    list_display = [
        'user_user_key',
        'desired_amount',
        'title',
        'descritption',
        'category',
    ]

admin.site.register(models.User, UserAdmin)
admin.site.register(models.Achivement, AchivementAdmin)
admin.site.register(models.Transaction, TransactionAdmin)
admin.site.register(models.Reward, RewardAdmin)
admin.site.register(models.Route, RouteAdmin)
admin.site.register(models.Task, TaskAdmin)
admin.site.register(models.Goal, GoalAdmin)
