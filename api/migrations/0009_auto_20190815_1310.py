# Generated by Django 2.2.4 on 2019-08-15 18:10

import api.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_task_steps'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='achivement',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='api.Achivement'),
        ),
        migrations.AlterField(
            model_name='route',
            name='tasks',
            field=models.TextField(max_length=255, validators=[api.models.validate_tasks]),
        ),
    ]
