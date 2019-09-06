from django.db import models
from django.db.models import Sum
from django.core.exceptions import ValidationError
from datetime import date
from django.utils.html import escape
from django.utils.safestring import mark_safe
from django.db.models import Q
from django.conf import settings
from . import services
import base64
import jsonfield
import uuid
import re
import os


class Icon(models.Model):
    name = models.CharField(max_length=45)
    image = models.ImageField(upload_to="upload/icons/", null=True, blank=True)
    encoded = models.TextField(blank=True)

    def image_data(self):
        return "data:image/png;base64,%s" % self.encoded

    def image_icon(self):
        return mark_safe('<img height="24px" src="%s" />' % self.image_data())

    image_icon.short_description = 'Image'
    image_icon.allow_tags = True

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.image:
            with open(self.image.path, "rb") as image_file:
                self.encoded = base64.b64encode(image_file.read()).decode('utf-8')
            os.remove(self.image.path)
            self.image = None
            super().save(*args, **kwargs)


class Category(models.Model):
    name = models.CharField(max_length=255)
    icon = models.ForeignKey(Icon, on_delete=models.PROTECT)

    def __str__(self):
        return self.name


class User(models.Model):
    user_key = models.BigIntegerField()

    def __str__(self):
        return "%d" % self.user_key

    def delete(self):
        RewardUser.objects.filter(user_user_key=self).delete()
        AchivementUser.objects.filter(user_user_key=self).delete()
        TaskUser.objects.filter(user_user_key=self).delete()
        Goal.objects.filter(user_user_key=self).delete()
        Transaction.objects.filter(user_user_key=self).delete()
        Route.objects.filter(user_user_key=self).delete()
        super().delete()


class Transaction(models.Model):
    user_user_key = models.ForeignKey(User, on_delete=models.PROTECT)
    description = models.TextField()
    city_pings = models.IntegerField()
    earnings = models.IntegerField()
    losts = models.IntegerField()

    def __str__(self):
        return "Transaction #%d" % self.id


class Vendor(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Reward(models.Model):
    title = models.CharField(max_length=255)
    cost = models.IntegerField()
    description = models.TextField(max_length=500)
    vendor = models.ForeignKey(Vendor, on_delete=models.PROTECT)
    picture = models.ImageField(
        upload_to="upload/rewards/",
        null=True, blank=True
    )
    initial = models.IntegerField()
    left = models.IntegerField()
    info = models.CharField(max_length=255)
    success_m = models.CharField(max_length=255)

    def __str__(self):
        return self.title


def validate_reward(value):
    if isinstance(value, int):
        value = Reward.objects.get(id=value)
    if value.left <= 0:
        raise ValidationError("The resources are depleted")


class RewardUser(models.Model):
    user_user_key = models.ForeignKey(User, on_delete=models.PROTECT)
    reward = models.ForeignKey(
        Reward,
        on_delete=models.PROTECT,
        validators=[validate_reward]
    )
    status = models.CharField(max_length=100)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False)
    qr = models.TextField(blank=True)
    pdf = models.TextField(blank=True)
    validated = models.BooleanField(default=False)

    def qr_data(self):
        return 'data:image/png;base64,%s' % self.qr

    def image_qr(self):
        return mark_safe('<img height="100px" src="%s" />' % self.qr_data())

    image_qr.short_description = 'QR Code'
    image_qr.allow_tags = True

    def download_pdf(self):
        return mark_safe('<a href="data:application/pdf;base64, %s" download>Download</a>' % self.pdf)

    download_pdf.short_description = 'Download PDF'
    download_pdf.allow_tags = True

    def save(self, *args, **kwargs):

        # Get last transaction

        last_trans = Transaction.objects.filter(
            user_user_key=self.user_user_key
        ).last()
        last_citi_pings = last_trans.city_pings if last_trans else 0

        # Save transaction

        Transaction.objects.create(
            user_user_key=self.user_user_key,
            description="Get reword %s" % self.reward.title,
            earnings=0,
            city_pings=last_citi_pings - self.reward.cost,
            losts=self.reward.cost
        )

        # Create QR
        self.qr = services.QrService().create("%s%s" % (
            settings.CLAIM_URI,
            self.uuid
        ))

        # Create PDF
        pdfs = services.PDFService('qr_template.html')
        self.pdf = pdfs.create({
            "title": self.reward.title,
            "qr": self.qr,
            "uuid": "%s/%s" % (settings.CLAIM_URI, self.uuid)
        })

        super().save(*args, **kwargs)

        self.reward.left -= 1
        self.reward.save()


def validate_tasks(value):
    if not re.match(r'^\[\]|\[(\s*\d+\s*\,)*\s*\d+\s*\]$', value):
        error_message = 'The text must begin with " [ " , end with " ] " and each Task_ID must be separated by a hyphen " , ".'
        raise ValidationError(error_message)
    return value


class Route(models.Model):
    user_user_key = models.ForeignKey(User, on_delete=models.PROTECT)
    tasks = models.TextField(
        max_length=255,
        validators=[validate_tasks]
    )

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
    steps = jsonfield.JSONField(blank=True, null=True)
    conditions = jsonfield.JSONField()
    order = models.IntegerField(blank=True)
    media = models.CharField(max_length=255, blank=True, null=True)
    check_task = models.CharField(max_length=255)

    def save(self, *args, **kwargs):
        if self.order is None:
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


class RouteTask(models.Model):
    title = models.CharField(max_length=255)
    task = models.OneToOneField(Task, on_delete=models.CASCADE)
    brief_description = models.TextField()
    card_description = models.TextField()
    card_icon = models.ForeignKey(
        Icon,
        on_delete=models.PROTECT
    )
    info_b = models.CharField(max_length=45)


class TaskUser(models.Model):
    user_user_key = models.ForeignKey(User, on_delete=models.PROTECT)
    task = models.ForeignKey(Task, on_delete=models.PROTECT)
    status = models.CharField(max_length=100)

    class Meta:
        unique_together = ['user_user_key', 'task']

    def save(self, *args, **kwargs):
        is_update = self.id
        super().save(*args, **kwargs)
        if not is_update:
            last_trans = Transaction.objects.filter(
                user_user_key=self.user_user_key
            ).last()
            last_citi_pings = last_trans.city_pings if last_trans else 0
            Transaction.objects.create(
                user_user_key=self.user_user_key,
                description="Complete task %s" % self.task.name,
                earnings=self.task.city_points_value,
                city_pings=last_citi_pings + self.task.city_points_value,
                losts=0
            )
            achiv = Achivement.objects.filter(task=self.task).first()
            if achiv:
                AchivementUser.objects.create(
                    achivement=achiv,
                    user_user_key=self.user_user_key,
                    unlock_date=date.today()
                )
            tasks = Route.objects.filter(user_user_key=self.user_user_key)
            tasks_user = TaskUser.objects.filter(
                user_user_key=self.user_user_key
            ).distinct('user_user_key')
            if tasks_user >= len(json.loads(tasks)):
                for achivement in Achivement.objects.filter(on_complete=True):
                    AchivementUser.objects.create(
                        user_user_key=self.user_user_key,
                        achivement=achivement
                    )


class Achivement(models.Model):
    name = models.CharField(max_length=255)
    city_points_value = models.IntegerField()
    icon = models.ForeignKey(Icon, on_delete=models.PROTECT)
    description = models.TextField()
    task = models.ForeignKey(
        Task,
        blank=True,
        null=True,
        on_delete=models.PROTECT
    )
    on_complete = models.BooleanField(default=True)

    def image_icon(self):
        return self.icon.image_icon()

    image_icon.short_description = 'Icon'
    image_icon.allow_tags = True

    def __str__(self):
        return self.name


class AchivementUser(models.Model):
    user_user_key = models.ForeignKey(User, on_delete=models.PROTECT)
    achivement = models.ForeignKey(Achivement, on_delete=models.PROTECT)
    unlock_date = models.DateField(auto_now_add=True)

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
    description = models.TextField(max_length=500, blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)

    def __str__(self):
        return "Goal #%d" % self.id


class Question(models.Model):
    STEP = 10
    YESNO = 'yesNo'
    DATE = 'date'
    YES = 'yes'
    NO = 'no'

    question = models.CharField(max_length=255)
    question_icon = models.ForeignKey(
        Icon,
        null=True,
        on_delete=models.PROTECT
    )
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

    def image_icon(self):
        return self.question_icon.image_icon()

    image_icon.short_description = 'Question icon'
    image_icon.allow_tags = True

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
            elif response == self.NO:
                return self.not_id

    def prev(self):
        prev = Question.objects.filter(
            Q(yes_id=self.id) | Q(not_id=self.id)
        ).filter(order__lt=self.order).first()
        if not prev:
            prev = Question.objects.filter(order=self.order - self.STEP).last()
        return prev

    def get_order(self):
        return int(self.order/self.STEP)
