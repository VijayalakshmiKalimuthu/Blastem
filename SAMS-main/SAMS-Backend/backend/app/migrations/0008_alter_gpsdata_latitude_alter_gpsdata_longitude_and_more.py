# Generated by Django 4.2.4 on 2023-08-20 15:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0007_alter_gpsdata_latitude_alter_gpsdata_longitude_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gpsdata',
            name='latitude',
            field=models.FloatField(null=True),
        ),
        migrations.AlterField(
            model_name='gpsdata',
            name='longitude',
            field=models.FloatField(null=True),
        ),
        migrations.AlterField(
            model_name='gpsdata',
            name='speed',
            field=models.FloatField(null=True),
        ),
    ]