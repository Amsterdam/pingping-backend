# Generated by Django 2.2.4 on 2019-08-15 18:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_auto_20190815_1310'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='task',
            name='achivement',
        ),
        migrations.AddField(
            model_name='achivement',
            name='task',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='api.Task'),
        ),
    ]