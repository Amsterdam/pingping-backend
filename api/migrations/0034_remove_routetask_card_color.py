# Generated by Django 2.2.4 on 2019-08-27 21:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0033_auto_20190827_1457'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='routetask',
            name='card_color',
        ),
    ]
