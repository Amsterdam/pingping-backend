# Generated by Django 2.2.4 on 2019-08-26 19:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0028_auto_20190823_1404'),
    ]

    operations = [
        migrations.CreateModel(
            name='RouteTask',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('brief_description', models.TextField()),
                ('card_description', models.TextField()),
                ('card_icon', models.TextField()),
                ('card_color', models.CharField(max_length=8)),
                ('info_b', models.CharField(max_length=45)),
                ('task', models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, to='api.Task')),
            ],
        ),
    ]