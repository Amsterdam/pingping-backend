# Generated by Django 2.2.4 on 2019-08-28 15:23

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0036_icon_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='icon',
            name='image',
            field=models.ImageField(upload_to='upload/icons/'),
        ),
        migrations.AlterField(
            model_name='question',
            name='question_icon',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='api.Icon'),
        ),
    ]