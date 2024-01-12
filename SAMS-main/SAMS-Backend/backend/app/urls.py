
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home),

    # -------------------------------------------- AUTHENTICATION --------------------------------------------#
    path('login_admin', views.login_admin),
    path('login_user', views.login_user),
    path('send_login_otp', views.send_login_otp),
    path('register', views.register),
    path('verify_credential', views.verify_credential),
    path('send_otp', views.send_otp),
    path('reset_password', views.reset_password),
    path('logout', views.logout),
    
    # -------------------------------------------- DASHBOARD --------------------------------------------#
    path('get_device_registry', views.get_device_registry),
    path('filter_device_data', views.filter_device_data),
    path('register_device', views.register_device),
    path('update_device', views.update_device),
    path('delete_device', views.delete_device), 
    path('get_vehicle_numbers', views.get_vehicle_numbers),
    path('get_user_role', views.get_user_role),
    
    # -------------------------------------------- DEVICE ENDPOINTS --------------------------------------------#
    path('save_bulk_data', views.save_bulk_data),
    path('save_device_data', views.save_device_data),
    path('get_current_data', views.get_current_data),
    path('trigger_emergency', views.trigger_emergency),
    path('get_device_info', views.get_device_info),
    
    # -------------------------------------------- DATA STORE --------------------------------------------#
    path('add_dataStore', views.add_dataStore),
    path('update_dataStore', views.update_dataStore),
    path('get_dataStore', views.get_dataStore),
    path('delete_dataStore', views.delete_dataStore),
    
    # -------------------------------------------- DATA STORE SEGMENT --------------------------------------------#
    path('add_dataStoreSegment', views.add_dataStoreSegment),
    path('update_dataStoreSegment', views.update_dataStoreSegment),
    path('get_dataStoreSegment', views.get_dataStoreSegment),
    path('delete_dataStoreSegment', views.delete_dataStoreSegment),

]