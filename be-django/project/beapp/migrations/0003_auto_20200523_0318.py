# Generated by Django 3.0.5 on 2020-05-23 03:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('beapp', '0002_auto_20200501_1046'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='tour',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='beapp.Tour'),
        ),
        migrations.AlterField(
            model_name='truck',
            name='capacity',
            field=models.IntegerField(blank=True, default=1000),
        ),
    ]
