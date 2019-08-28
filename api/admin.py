from django.contrib import admin
from django_json_widget.widgets import JSONEditorWidget
from import_export.admin import ImportExportModelAdmin
from import_export import resources
from admin_ordering.admin import OrderableAdmin
from . import models
import jsonfield


class IconResource(resources.ModelResource):

    class Meta:
        model = models.Icon
        fields = ('id', 'name', 'encoded',)


class IconAdmin(ImportExportModelAdmin):
    resource_class = IconResource
    list_display = [
        'image_icon',
        'name',
    ]


class UserAdmin(admin.ModelAdmin):
    list_display = [
        'user_key',
    ]


class AchivementAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'city_points_value',
        'image_icon',
        'description'
    ]


class AchivementUserAdmin(admin.ModelAdmin):
    list_display = [
        'user_user_key',
        'achivement',
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
        'title',
        'cost',
        'description',
        'vendor',
    ]


class RewardUserAdmin(admin.ModelAdmin):
    list_display = [
        'image_qr',
        'user_user_key',
        'reward',
        'status',
        'download_pdf'
    ]

    readonly_fields = ('image_qr',)
    readonly_fields = ('download_pdf',)


class RouteAdmin(admin.ModelAdmin):
    list_display = [
        'user_user_key',
        'tasks',
    ]


class RouteTaskInlined(admin.StackedInline):
    model = models.RouteTask


class TaskAdmin(OrderableAdmin, ImportExportModelAdmin):
    inlines = [RouteTaskInlined]
    ordering_field = 'order'
    ordering = ['order']
    ordering_field_hide_input = True
    list_display = [
        'name',
        'description',
        'city_points_value',
        'order',
        'media',
        'check_task'
    ]
    list_editable = ('order', )


class RouteTaskAdmin(ImportExportModelAdmin):
    list_display = [
        'title',
        'task',
        'brief_description',
        'card_description',
        'card_icon',
        'info_b',
    ]


class TaskUserAdmin(admin.ModelAdmin):
    list_display = [
        'user_user_key',
        'task',
        'status',
    ]


class GoalAdmin(admin.ModelAdmin):
    list_display = [
        'user_user_key',
        'desired_amount',
        'title',
        'description',
        'category',
    ]


class QuestionResource(resources.ModelResource):

    class Meta:
        model = models.Question

    def get_queryset(self):
        return self._meta.model.objects.order_by('-order')


class QuestionAdmin(OrderableAdmin, ImportExportModelAdmin):
    resource_class = QuestionResource
    ordering_field = 'order'
    ordering = ['order']
    ordering_field_hide_input = True
    list_display = [
        'question',
        'image_icon',
        'type',
        'yes_text',
        'yes_id',
        'not_text',
        'not_id',
        'order',
    ]
    list_editable = ('order', )
    readonly_fields = ('image_icon',)


class VendorAdmin(admin.ModelAdmin):
    list_display = [
        'name',
    ]


admin.site.register(models.Icon, IconAdmin)
admin.site.register(models.User, UserAdmin)
admin.site.register(models.Achivement, AchivementAdmin)
admin.site.register(models.AchivementUser, AchivementUserAdmin)
admin.site.register(models.Transaction, TransactionAdmin)
admin.site.register(models.Reward, RewardAdmin)
admin.site.register(models.RewardUser, RewardUserAdmin)
admin.site.register(models.Route, RouteAdmin)
admin.site.register(models.Task, TaskAdmin)
admin.site.register(models.RouteTask, RouteTaskAdmin)
admin.site.register(models.TaskUser, TaskUserAdmin)
admin.site.register(models.Goal, GoalAdmin)
admin.site.register(models.Question, QuestionAdmin)
admin.site.register(models.Vendor, VendorAdmin)
