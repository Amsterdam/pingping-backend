# Generated by Django 2.2.4 on 2019-08-22 21:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0023_vendor'),
    ]

    operations = [
        migrations.RenameField(
            model_name='reward',
            old_name='name',
            new_name='title',
        ),
        migrations.AddField(
            model_name='reward',
            name='initial',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='reward',
            name='left',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='reward',
            name='picture',
            field=models.ImageField(blank=True, null=True, upload_to='upload/rewards/'),
        ),
        migrations.AlterField(
            model_name='reward',
            name='vendor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='api.Vendor'),
        ),
    ]