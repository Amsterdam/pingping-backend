# Generated by Django 2.2.4 on 2019-08-14 20:53

from django.db import migrations, models
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_task_order'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='route',
            name='city_points_value',
        ),
        migrations.AddField(
            model_name='task',
            name='city_points_value',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='task',
            name='conditions',
            field=jsonfield.fields.JSONField(),
        ),
    ]
