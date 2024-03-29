# Generated by Django 4.2.4 on 2023-08-20 14:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_gpsdata'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gpsdata',
            name='latitude',
            field=models.DecimalField(decimal_places=10, max_digits=20, null=True),
        ),
        migrations.AlterField(
            model_name='gpsdata',
            name='longitude',
            field=models.DecimalField(decimal_places=10, max_digits=20, null=True),
        ),
        migrations.AlterField(
            model_name='gpsdata',
            name='speed',
            field=models.DecimalField(decimal_places=5, max_digits=10, null=True),
        ),
    ]
