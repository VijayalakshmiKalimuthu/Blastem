from django.contrib import admin

from .models import User
from .models import Customer
from .models import GpsData
from .models import Device

admin.site.register(User)
admin.site.register(Customer)
admin.site.register(GpsData)
admin.site.register(Device)
