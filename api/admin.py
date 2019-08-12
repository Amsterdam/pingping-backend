from django.contrib import admin
from . import models


class UserAdmin(admin.ModelAdmin):
    pass


class AchivementAdmin(admin.ModelAdmin):
    pass


class TransactionAdmin(admin.ModelAdmin):
    pass


class RewardAdmin(admin.ModelAdmin):
    pass


class RouteAdmin(admin.ModelAdmin):
    pass


class TaskAdmin(admin.ModelAdmin):
    pass


class GoalAdmin(admin.ModelAdmin):
    pass

admin.site.register(models.User, UserAdmin)
admin.site.register(models.Achivement, AchivementAdmin)
admin.site.register(models.Transaction, TransactionAdmin)
admin.site.register(models.Reward, RewardAdmin)
admin.site.register(models.Route, RouteAdmin)
admin.site.register(models.Task, TaskAdmin)
admin.site.register(models.Goal, GoalAdmin)
