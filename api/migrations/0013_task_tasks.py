# Generated by Django 2.2.4 on 2019-08-15 19:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_auto_20190815_1441'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='tasks',
            field=models.ManyToManyField(blank=True, to='api.Task'),
        ),
    ]