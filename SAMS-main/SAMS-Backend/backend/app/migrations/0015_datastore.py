# Generated by Django 4.2.4 on 2023-08-24 08:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0014_alter_customer_tyre_size'),
    ]

    operations = [
        migrations.CreateModel(
            name='DataStore',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('latitude', models.FloatField()),
                ('longitude', models.FloatField()),
                ('speed', models.FloatField()),
                ('police_station_contact', models.CharField(max_length=100, null=True)),
                ('ambulance_contact', models.CharField(max_length=100, null=True)),
            ],
        ),
    ]
