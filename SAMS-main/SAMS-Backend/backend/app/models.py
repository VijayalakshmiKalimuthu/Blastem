from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.core.exceptions import ValidationError
from django.utils.timezone import now

# Create your models here.

class User(models.Model):
    username = models.CharField(max_length=50, null=False, primary_key=True)
    password = models.CharField(max_length=150, null=False)
    email = models.EmailField(max_length=100, null=False)

    def __str__(self):
        return self.username

class Customer(models.Model):
    name = models.CharField(max_length=100, null=False)
    email = models.EmailField(null=True)
    address = models.TextField()
    state = models.CharField(max_length=50, null=False)
    city = models.CharField(max_length=50, null=False)
    pincode = models.CharField(max_length=10, null=False)
    phone = models.CharField(max_length=20, null=False)
    vehicles = ArrayField(models.CharField(max_length=100), blank=True, null=True)
    emergency_contacts = ArrayField(models.CharField(max_length=100), blank=True, null=True)
    # tyre_size = models.FloatField(null=True)
    # pulses = models.FloatField(null=True)
    

    def __str__(self):
        return self.name

class Vehicle(models.Model):
    vehicle_number = models.CharField(max_length=100, null=False)
    tyre_size = models.FloatField(null=True)
    pulses = models.FloatField(null=True)
    device_id = models.CharField(max_length=100, null=False)

class Device(models.Model):
    device_id = models.CharField(max_length=100, null=False)
    vehicle_number = models.CharField(max_length=20, null=False)

    def __str__(self):
        return str(self.device_id)

class GpsData(models.Model):
    device_id = models.CharField(max_length=50, null=False)
    vehicle_number = models.CharField(max_length=20, db_index=True, null=False)
    timestamp = models.DateTimeField(auto_now=True)
    latitude = models.FloatField(null=True)
    longitude = models.FloatField(null=True)
    speed = models.FloatField(null=True)

    class Meta:
        indexes = [
            models.Index(fields=['vehicle_number']),
        ]

    def clean(self):
        if not (-90 <= self.latitude <= 90):
            raise ValidationError("Latitude must be between -90 and 90 degrees.")
        if not (-180 <= self.longitude <= 180):
            raise ValidationError("Longitude must be between -180 and 180 degrees.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

class DataStore(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    speed = models.FloatField()
    police_station_contact = models.CharField(max_length=100, null=True)
    ambulance_contact = models.CharField(max_length=100, null=True)
    segment = models.ForeignKey('DataStoreSegment', on_delete=models.CASCADE, null=True, related_name='data_points')

    def clean(self):
        if not (-90 <= self.latitude <= 90):
            raise ValidationError("Latitude must be between -90 and 90 degrees.")
        if not (-180 <= self.longitude <= 180):
            raise ValidationError("Longitude must be between -180 and 180 degrees.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

class DataStoreSegment(models.Model):
    start_latitude = models.FloatField()
    start_longitude = models.FloatField()
    end_latitude = models.FloatField()
    end_longitude = models.FloatField()
    speed = models.FloatField()
    police_station_contact = models.CharField(max_length=100, null=True)
    ambulance_contact = models.CharField(max_length=100, null=True)
    
    def clean(self):
        if not (-90 <= self.start_latitude <= 90):
            raise ValidationError("Latitude must be between -90 and 90 degrees.")
        if not (-180 <= self.start_longitude <= 180):
            raise ValidationError("Longitude must be between -180 and 180 degrees.")
        if not (-90 <= self.end_latitude <= 90):
            raise ValidationError("Latitude must be between -90 and 90 degrees.")
        if not (-180 <= self.end_longitude <= 180):
            raise ValidationError("Longitude must be between -180 and 180 degrees.")
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)