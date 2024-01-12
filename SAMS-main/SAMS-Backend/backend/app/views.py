import datetime
import json
from math import atan2
import math
from random import sample
import threading
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from numpy import *
from .models import Customer, DataStore, DataStoreSegment, Device, GpsData, User, Vehicle
from django.core.mail import send_mail
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.sessions.backends.signed_cookies import SessionStore
import decimal
from datetime import datetime, timedelta
from django.utils import timezone
from django.core.serializers import serialize

# Create your views here.

# -------------------------------------------- AUTHENTICATION --------------------------------------------#


def home(request):

    return JsonResponse({
        'Success': True,
        'Message': 'Vanakkam Bruh!!',
    })

# added invalid request handling


@csrf_exempt
def login_admin(request):

    if (request.method != 'POST'):
        return JsonResponse({
            'success': False,
            'message': 'Invalid Request'
        }, status=400)

    try:
        postData = json.loads(request.body)
        credential = postData['credential']
        password = postData['password']
        type = postData['type']

        flag = False
        if (type == 'username'):
            if User.objects.filter(username=credential).exists():
                user = User.objects.get(username=credential)
                flag = True
        else:
            if User.objects.filter(email=credential).exists():
                user = User.objects.get(email=credential)
                flag = True

        if flag:
            if check_password(password, user.password):

                request.session['credential'] = credential
                request.session['role'] = 'admin'

                response = JsonResponse({
                    'success': True,
                    'message': 'Login Successful',
                    'username': user.username
                })

                return response

            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Incorrect Password'
                })
        else:
            return JsonResponse({
                'success': False,
                'message': 'Username Not Found' if type == 'username' else 'Email Not Registered'
            })

    except Exception as e:
        print('Exception : ', e)
        return JsonResponse({
            'success': False,
            'message': "Error Logging In"
        }, status=200)


@csrf_exempt
def send_login_otp(request):

    if (request.method != 'POST'):
        return JsonResponse({
            'success': False,
            'message': 'Invalid Request'
        }, status=400)

    try:
        postData = json.loads(request.body)

        phone = postData['phone']

        customer = Customer.objects.filter(phone=phone)

        if (len(customer) == 0):
            return JsonResponse({
                'success': False,
                'message': 'Phone Number Not Registered!!',
            })

        else:
            otp = sample(range(0, 10), 4)
            otp_str = "".join(map(str, otp))

            return JsonResponse({
                'success': True,
                'message': 'OTP Sent Successfully!!',
                'otp': otp_str,
            })

    except Exception as e:
        print('Exception : ', e)
        return JsonResponse({
            'success': False,
            'message': 'Some Error Occured!!',
        }, status=200)


@csrf_exempt
def login_user(request):
    if (request.method != 'POST'):
        return JsonResponse({
            'success': False,
            'message': 'Invalid Request'
        }, status=400)

    try:
        phone = json.loads(request.body)['phone']
        customer = Customer.objects.filter(phone=phone)
        customer = customer[0]
        request.session['credential'] = customer.phone
        request.session['role'] = 'customer'

        return JsonResponse({
            'success': True,
            'message': 'Login Successful!!',
            'username': customer.name
        })

    except Exception as e:
        print('Exception : ', e)
        return JsonResponse({
            'success': False,
            'message': 'Error Logging In!!',
        }, status=200)


@csrf_exempt
def register(request):

    if (request.method != 'POST'):
        return JsonResponse({
            'success': False,
            'message': 'Invalid Request'
        }, status=400)

    try:
        postData = json.loads(request.body)
        username = postData['username']
        password = postData['password']
        email = postData['email']
        # Temporary Changes, Will be removed later
        valid_mail = ["blastemindustries@gmail.com",
                      "vbindustries96@gmail.com", "venkatesh6941@gmail.com", "01kumaragupta@gmail.com"]

        if User.objects.filter(username=username).exists():
            return JsonResponse({
                'success': False,
                'message': 'Username Already Exists',
            })
        elif User.objects.filter(email=email).exists():
            return JsonResponse({
                'success': False,
                'message': 'Email Already Exists',
            })
        else:
            if email in valid_mail:
                hashed_password = make_password(password)
                user = User(username=username,
                            password=hashed_password, email=email)
                user.save()
                print("Success")
                return JsonResponse({
                    'success': True,
                    'message': 'User Created Successfully',
                })

            else:
                return JsonResponse({
                    "success": False,
                    "message": "Sorry, You are not eligible for registration"
                })

    except Exception as e:
        print('Exception : ', e)
        return JsonResponse({
            'success': False,
            'message': 'Some Error Occured!!',
        }, status=200)


@csrf_exempt
def verify_credential(request):
    mailids = ["blastemindustries@gmail.com",
               "vbindustries96@gmail.com", "Venkatesh6941@gmail.com", "01kumaragupta@gmail.com"]

    if (request.method != 'POST'):
        return JsonResponse({
            'success': False,
            'message': 'Invalid Request'
        }, status=400)

    try:
        postData = json.loads(request.body)
        type = postData['type']

        credential = postData['credential']

        if (type == 'username'):
            if User.objects.filter(username=credential).exists():
                return JsonResponse({
                    'success': False,
                    'message': 'Username Already Exists!!',
                })
            else:
                return JsonResponse({
                    'success': True,
                    'message': 'Username Available!!',
                })

        elif (type == 'email'):
            if User.objects.filter(email=credential).exists():
                return JsonResponse({
                    'success': False,
                    'message': 'Mail ID Already Connected!!',
                })
            elif (credential not in mailids):
                return JsonResponse({
                    "success": False,
                    'message': 'Sorry, You are not eligible for registration!!',

                })
            else:
                return JsonResponse({
                    'success': True,
                    'message': 'Mail ID Available!!',
                })

        else:
            return JsonResponse({
                'success': False,
                'message': 'Invalid Credential Type!!',
            })

    except Exception as e:
        print('Exception : ', e)
        return JsonResponse({
            'success': False,
            'message': 'Some Error Occured!!',
        }, status=200)


@csrf_exempt
def send_otp(request):

    if (request.method != 'POST'):
        return JsonResponse({
            'success': False,
            'message': 'Invalid Request'
        }, status=400)

    try:
        # Temporary Changes, Will be removed later
        valid_mail = ["blastemindustries@gmail.com",
                      "vbindustries96@gmail.com", "venkatesh6941@gmail.com", "01kumaragupta@gmail.com"]

        postData = json.loads(request.body)
        
        print("Trying to send OTP")

        action = postData['action']
        username = postData['username']
        email = postData['email']

        otp = sample(range(0, 10), 4)
        otp = "".join(map(str, otp))

        from_email = '01srikumaran@gmail.com'
        to_email = email
        message = f'Your OTP is {otp}'

        if (action == 'verify'):
            subject = 'OTP for Verifying you Mail ID!!'

            if email in valid_mail:

                if User.objects.filter(username=username).exists():
                    return JsonResponse({
                        'success': False,
                        'message': 'Username Already Exists!!',
                        'otp': None
                    })

                elif (User.objects.filter(email=email).exists()):
                    return JsonResponse({
                        'success': False,
                        'message': 'Mail ID Already Registered!!',
                        'otp': None,
                    })

                else:
                    send_mail(
                        subject=subject,
                        message=message,
                        from_email=from_email,
                        recipient_list=[to_email],
                        fail_silently=False
                    )

                    return JsonResponse({
                        'success': True,
                        'message': 'OTP Sent Successfully!!',
                        'otp': otp,
                    })

            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Mail ID Not Eligible!!',
                    'otp': None,
                })

        elif (action == 'reset'):

            subject = 'OTP for Resetting your Password!!'

            if User.objects.filter(email=email).exists():
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=from_email,
                    recipient_list=[to_email],
                    fail_silently=False
                )

                return JsonResponse({
                    'success': True,
                    'message': 'OTP Sent Successfully!!',
                    'otp': otp,
                })

            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Mail ID Not Registered!!',
                    'otp': None,
                })

    except Exception as e:
        print('Exception : ', e)
        return JsonResponse({
            'success': False,
            'message': 'Error Sending OTP!!',
            'otp': None
        }, status=200)


@csrf_exempt
def reset_password(request):

    if (request.method != 'POST'):
        return JsonResponse({
            'success': False,
            'message': 'Invalid Request'
        }, status=400)

    try:
        postData = json.loads(request.body)

        email = postData['email']
        new_password = postData['new_password']

        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            hashed_password = make_password(new_password)
            user.password = hashed_password
            user.save()

            return JsonResponse({
                'success': True,
                'message': 'Password Changed Successfully!!',
            })

        else:
            return JsonResponse({
                'success': False,
                'message': 'Mail ID Not Registered!!',
            })

    except Exception as e:
        print('Exception : ', e)
        return JsonResponse({
            'success': False,
            'message': 'Error Changing Password!!',
        }, status=200)

# -------------------------------------------- DASHBOARD --------------------------------------------#

# Modified for 'VEHICLE' model
@csrf_exempt
def register_device(request):
    '''
        {
            vehicle_number: string,
            device_id: string,
            name: string,
            address: string,
            state: string,
            city: string,
            pincode: string,
            phone: string,
        }
    '''

    if (request.method != 'POST'):
        return JsonResponse({
            'success': False,
            'message': 'Invalid Request'
        }, status=400)

    try:
        if (request.session.get('credential') is None or request.session.get('role') != 'admin'):
            return JsonResponse({
                'success': False,
                'message': 'Admin Not Logged In!!',
            })
        else:
            postData = json.loads(request.body)
            vehicle_number = postData['vehicle_number']
            device_id = postData['device_id']
            name = postData['name']
            address = postData['address']
            state = postData['state']
            city = postData['city']
            pincode = postData['pincode']
            phone = postData['phone']
            emergency_contact_1 = postData['emergency_contact_1']
            emergency_contact_2 = postData['emergency_contact_2']
            
            # For 'VEHICLE' model
            tyre_size = postData['tyre_size']
            pulses = postData['pulses']

            if Device.objects.filter(device_id=device_id).exists():
                return JsonResponse({
                    'success': False,
                    'message': 'Device Already Registered!!',
                })

            else:
                customer_objs = Customer.objects.filter(
                    name=name,
                    address=address,
                    state=state,
                    city=city,
                    pincode=pincode,
                    phone=phone,
                    emergency_contacts=[
                        emergency_contact_1, emergency_contact_2],
                    # tyre_size=tyre_size,
                    # pulses=pulses
                )
                
                # Creating 'VEHICLE' object
                vehicle_obj = Vehicle(
                    vehicle_number=vehicle_number,
                    device_id=device_id,
                    tyre_size=tyre_size,
                    pulses=pulses
                )
                
                if len(customer_objs) > 0:
                    customer = customer_objs[0]
                    if (vehicle_number not in customer.vehicles):
                        customer.vehicles.append(vehicle_number)
                        customer.save()
                        # Saving 'VEHICLE' object
                        vehicle_obj.save()
                    else:
                        return JsonResponse({
                            'success': False,
                            'message': 'Vehicle Already Registered!!',

                        })

                else:
                    if Device.objects.filter(vehicle_number=vehicle_number).exists():
                        return JsonResponse({
                            'success': False,
                            'message': 'Vehicle Already Registered!!',
                        })
                    else:
                        customer = Customer(
                            name=name,
                            address=address,
                            state=state,
                            city=city,
                            pincode=pincode,
                            phone=phone,
                            vehicles=[vehicle_number],
                            emergency_contacts=[
                                emergency_contact_1, emergency_contact_2],
                            # tyre_size=tyre_size,
                            # pulses=pulses
                        )
                        customer.save()
                        
                        # Saving 'VEHICLE' object
                        vehicle_obj.save()
                        
                device = Device(device_id=device_id,
                                vehicle_number=vehicle_number)
                device.save()

                return JsonResponse({
                    'success': True,
                    'message': 'Device Registered Successfully!!',
                    'original_id': customer.pk,
                })

    except Exception as e:
        print('Exception : ', e)
        return JsonResponse({
            'success': False,
            'message': 'Error Registering Device!!',
        }, status=200)

# Modified for 'VEHICLE' model
@csrf_exempt
def update_device(request):

    if (request.method != 'POST'):
        return JsonResponse({
            'success': False,
            'message': 'Invalid Request'
        }, status=400)

    try:
        if request.session.get('credential') and request.session.get('role') == 'admin':
            postData = json.loads(request.body)

            original_id = postData['original_id']
            device_id = postData['device_id']
            vehicle_number = postData['vehicle_number']
            name = postData['name']
            address = postData['address']
            state = postData['state']
            city = postData['city']
            pincode = postData['pincode']
            phone = postData['phone']
            emergency_contact_1 = postData['emergency_contact_1']
            emergency_contact_2 = postData['emergency_contact_2']
            
            # For 'VEHICLE' model
            tyre_size = postData['tyre_size']
            pulses = postData['pulses']

            customer_obj = Customer.objects.get(pk=original_id)

            customer_obj.name = name
            customer_obj.address = address
            customer_obj.state = state
            customer_obj.city = city
            customer_obj.pincode = pincode
            customer_obj.phone = phone
            customer_obj.emergency_contacts = [
                emergency_contact_1, emergency_contact_2]
            
            # customer_obj.tyre_size = tyre_size
            # customer_obj.pulses = pulses
            
            customer_obj.save()

            # For 'VEHICLE' model
            vehicle_obj = Vehicle.objects.get(vehicle_number=vehicle_number)
            vehicle_obj.tyre_size = tyre_size
            vehicle_obj.pulses = pulses
            vehicle_obj.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Device Updated Successfully!!',
            })

        else:
            return JsonResponse({
                'success': False,
                'message': 'Admin Not Logged In!!',
            }, status=400)

    except Exception as e:
        print('Exception : ', e)
        return JsonResponse({
            'success': False,
            'message': 'Error Updating Device!!',
        }, status=200)

# Modified for 'VEHICLE' model
@csrf_exempt
def get_device_registry(request):

    if (request.method != 'GET'):
        return JsonResponse({
            'success': False,
            'message': 'Invalid Request'
        }, status=400)

    device_registry = []

    try:
        if request.session.get('credential') and request.session.get('role') == 'admin':

            vehicle_numbers = Device.objects.all().values_list('vehicle_number', flat=True)
            a = 1
            for vehicle in vehicle_numbers:
                customer = Customer.objects.filter(
                    vehicles__contains=[vehicle])
                vehicle_obj = Vehicle.objects.get(vehicle_number=vehicle)

                if len(customer) > 0:
                    customer = customer[0]
                    device_obj = Device.objects.filter(vehicle_number=vehicle)[0]
                    device_registry.append({
                        'id': a,
                        'original_id': customer.pk,
                        'device_id': device_obj.device_id,
                        'vehicle_number': vehicle,
                        'name': customer.name,
                        'address': customer.address,
                        'state': customer.state,
                        'city': customer.city,
                        'pincode': customer.pincode,
                        'phone': customer.phone,
                        'emergency_contact_1': customer.emergency_contacts[0],
                        'emergency_contact_2': customer.emergency_contacts[1],
                        
                        'tyre_size': vehicle_obj.tyre_size,
                        'pulses': vehicle_obj.pulses,
                    })
                    a += 1

            return JsonResponse({
                'success': True,
                'data': device_registry,
            })

        else:
            return JsonResponse({
                'success': False,
                'data': device_registry,
                'message': 'Admin Not Logged In!!',
            }, status=400)

    except Exception as e:
        print('Exception : ', e)
        return JsonResponse({
            'success': False,
            'message': 'Error Fetching Device Registry!!',
        }, status=200)

# Modified for 'VEHICLE' model
@csrf_exempt
def delete_device(request):

    if (request.method != 'DELETE'):
        return JsonResponse({
            'success': False,
            'message': 'Invalid Request'
        }, status=400)

    try:
        if request.session.get('credential') and request.session.get('role') == 'admin':
            deleteData = json.loads(request.body)
            original_id = deleteData['original_id']
            vehicle_number = deleteData['vehicle_number']

            customer = Customer.objects.get(pk=original_id)
            customer.vehicles.remove(vehicle_number)
            
            if (len(customer.vehicles) == 0):
                customer.delete()
            else:
                customer.save()

            device = Device.objects.filter(vehicle_number=vehicle_number)
            device.delete()

            gps_data = GpsData.objects.filter(vehicle_number=vehicle_number)
            gps_data.delete()
            
            # For 'VEHICLE' model
            vehicle = Vehicle.objects.get(vehicle_number=vehicle_number)
            vehicle.delete()
            
            return JsonResponse({
                'success': True,
                'message': 'Device Deleted Successfully!!',
            })
        else:
            return JsonResponse({
                'success': False,
                'message': 'Admin Not Logged In!!',
            }, status=400)

    except Exception as e:
        print('Exception : ', e)
        return JsonResponse({
            'success': False,
            'message': 'Error Deleting Device!!',
        }, status=200)

#---------------------------------- Device Endpoints ----------------------------------#

def distance_between_two_points(latitude1, longitude1, latitude2, longitude2):
    lat1, lon1, lat2, lon2 = map(
        math.radians, [latitude1, longitude1, latitude2, longitude2])

    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * \
        math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))

    # Radius of earth in kilometers is 6371
    radius = 6371.0

    # calculate the result
    distance = c * radius

    return round(distance, 2)


def calculate_nearby_data(latitude, longitude):

    global nearby_data
    nearby_data = []

    try:
        cur_lat = latitude
        cur_long = longitude

        gps_data = DataStore.objects.values_list(
            'latitude', 'longitude', 'speed', 'police_station_contact', 'ambulance_contact')

        for data in gps_data:
            lat = data[0]
            long = data[1]

            distance = distance_between_two_points(
                cur_lat, cur_long, lat, long)

            if (distance <= 5):
                nearby_data.append({
                    'latitude': lat,
                    'longitude': long,
                    # 'distance': distance,
                    'speed_limit': data[2]
                })

        return nearby_data

    except Exception as e:
        print('Exception : ', e)
        return nearby_data


@csrf_exempt
def save_device_data(request):
    if (request.method != 'POST'):
        return JsonResponse({
            'success': False,
            'message': 'Invalid Request'
        }, status=400)

    try:
        postData = json.loads(request.body)
        device_id = postData['device_id']
        latitude = postData['latitude']
        longitude = postData['longitude']
        speed = postData['speed']

        if Device.objects.filter(device_id=device_id).count() == 0:
            return JsonResponse({
                'success': False,
                'message': 'Device ID Not Registered!!',
            })

        vehicle_number = Device.objects.get(device_id=device_id).vehicle_number

        gps_data = GpsData(
            device_id=device_id,
            vehicle_number=vehicle_number,
            latitude=latitude,
            longitude=longitude,
            speed=speed
        )

        gps_data.save()

        return JsonResponse({
            'success': True,
            'message': 'Device Data Saved Successfully!!',
        })

    except Exception as e:
        print('Exception : ', e)
        return JsonResponse({
            'success': False,
            'message': 'Error Saving Device Data!!',
        }, status=200)


@csrf_exempt
def get_current_data(request):
    if (request.method != 'GET'):
        return JsonResponse({
            'success': False,
            'message': 'Invalid Request'
        }, status=400)

    try:
        getData = json.loads(request.body)
        latitude = getData['latitude']
        longitude = getData['longitude']

        nearby_data = calculate_nearby_data(latitude, longitude)

        return JsonResponse({
            'success': True,
            'message': 'Data Fetched Successfully!!',
            'data': nearby_data[0:30] if len(nearby_data)>30 else nearby_data,
        })

    except Exception as e:
        print('Exception : ', e)
        return JsonResponse({
            'success': False,
            'message': 'Error Fetching Data!!'
        }, status=200)


@csrf_exempt
def trigger_emergency(request):
    if (request.method != 'POST'):
        return JsonResponse({
            'success': False,
            'message': 'Invalid Request'
        }, status=400)

    try:
        postData = json.loads(request.body)
        latitude = postData['latitude']
        longitude = postData['longitude']
        device_id = postData['device_id']

        if Device.objects.filter(device_id=device_id).count() == 0:
            return JsonResponse({
                'success': False,
                'message': 'Device ID Not Registered!!',
            })
        
        # nearby_data = calculate_nearby_data(latitude, longitude)
        # nearby_police_stations = [
        #     data['police_station_contact'] for data in nearby_data]
        # nearby_ambulance_contacts = [
        #     data['ambulance_contact'] for data in nearby_data]

        vehicle = Device.objects.get(device_id=device_id).vehicle_number
        customer = Customer.objects.filter(vehicles__contains=[vehicle])[0]
        emergency_contacts = customer.emergency_contacts

        return JsonResponse({
            'success': True,
            'message': 'Emergency Triggered Successfully!!',
            'nearby_police_stations': nearby_police_stations,
            'nearby_ambulance_contacts': nearby_ambulance_contacts,
            'emergency_contacts': emergency_contacts,
        })

    except Exception as e:
        print('Exception : ', e)
        return JsonResponse({
            'success': False,
            'message': 'Error Triggering Emergency!!'
        })


@csrf_exempt
def get_device_info(request):
    if (request.method != 'GET'):
        return JsonResponse({
            'success': False,
            'message': 'Invalid Request'
        }, status=400)

    try:
        getData = json.loads(request.body)
        device_id = getData['device_id']
        
        vehicles = Vehicle.objects.filter(device_id=device_id)
        
        if(len(vehicles) == 0):
            return JsonResponse({
                'success': False,
                'message': 'Device ID Not Registered!!',
            })
        
        vehicle = vehicles[0]
        tyre_size = vehicle.tyre_size
        pulses = vehicle.pulses

        return JsonResponse({
            'success': True,
            'message': 'Data Fetched Successfully!!',
            'data': {
                'tyre_size': tyre_size,
                'pulses': pulses,
            }
        })

    except Exception as e:
        print('Exception : ', e)
        return JsonResponse({
            'success': False,
            'message': 'Error Fetching Data!!'
        }, status=200)

#---------------------------------------------------------------------#

@csrf_exempt
def save_bulk_data(request):
    if (request.method != 'POST'):
        return JsonResponse({
            'success': False,
            'message': 'Invalid Request'
        }, status=400)

    try:
        postData = json.loads(request.body)
        bulk_data = postData['bulk_data']
        precision = 5

        for data in bulk_data:
            device_id = data['device_id']
            latitude = data['latitude']
            longitude = data['longitude']
            speed = round(data['speed'], 2)

            vehicle_number = Device.objects.get(
                device_id=device_id).vehicle_number

            gps_data = GpsData(
                device_id=device_id,
                vehicle_number=vehicle_number,
                latitude=latitude,
                longitude=longitude,
                speed=speed
            )

            gps_data.save()

        return JsonResponse({
            'success': True,
            'message': 'Bulk Data Saved Successfully!!',
        })

    except Exception as e:
        print('Exception : ', e)
        return JsonResponse({
            'success': False,
            'message': 'Error Saving Bulk Data!!',
        }, status=200)


@csrf_exempt
def filter_device_data(request):
    filtered_data = []

    if (request.method != 'POST'):
        return JsonResponse({
            'success': False,
            'message': 'Invalid Request'
        }, status=400)

    try:

        if request.session.get('credential') is None:
            return JsonResponse({
                'success': False,
                'message': 'User Not Logged In!!',
            })

        getData = json.loads(request.body)
        device_id = getData['device_id']
        vehicle_number = getData['vehicle_number']
        start_date = getData['start_date']
        end_date = getData['end_date']

        gps_data = []

        if vehicle_number == '' and device_id == '':
            return JsonResponse({
                'success': False,
                'data': filtered_data,
                'message': 'No Device ID or Vehicle Number Provided!!'
            })

        elif vehicle_number == '' and device_id != '' and request.session.get('role') == 'admin':
            if (Device.objects.filter(device_id=device_id).count() == 0):
                return JsonResponse({
                    'success': False,
                    'data': filtered_data,
                    'message': 'Device ID Not Registered!!'
                })
            else:
                gps_data = GpsData.objects.filter(device_id=device_id)
                if (len(gps_data) == 0):
                    return JsonResponse({
                        'success': True,
                        'data': filtered_data,
                        'message': 'No Data Found!!'
                    })

        elif vehicle_number != '' and device_id == '':
            role = request.session.get('role')
            if (Device.objects.filter(vehicle_number=vehicle_number).count() == 0):
                return JsonResponse({
                    'success': False,
                    'data': filtered_data,
                    'message': 'Vehicle Number Not Registered!!'
                })
            else:

                if (role == 'admin'):
                    if (len(Device.objects.filter(vehicle_number=vehicle_number)) == 0):
                        return JsonResponse({
                            'success': False,
                            'data': filtered_data,
                            'message': 'Vehicle Number Not Registered!!'
                        })

                    else:
                        gps_data = GpsData.objects.filter(
                            vehicle_number=vehicle_number)

                        if (len(gps_data) == 0):
                            return JsonResponse({
                                'success': True,
                                'data': filtered_data,
                                'message': 'No Data Found!!'
                            })

                else:
                    phone = request.session.get('credential')

                    if (len(Customer.objects.filter(phone=str(phone), vehicles__contains=[vehicle_number])) == 0):
                        return JsonResponse({
                            'success': False,
                            'data': filtered_data,
                            'message': 'Vehicle Number Not Registered!!'
                        })
                    else:
                        gps_data = GpsData.objects.filter(
                            vehicle_number=vehicle_number)

                        if (len(gps_data) == 0):
                            return JsonResponse({
                                'success': True,
                                'data': filtered_data,
                                'message': 'No Data Found!!'
                            })

        start_date_obj = timezone.make_aware(datetime.strptime(
            start_date, '%Y-%m-%d'), timezone.get_current_timezone())
        end_date_obj = timezone.make_aware(datetime.strptime(
            end_date, '%Y-%m-%d'), timezone.get_current_timezone()) + timedelta(days=1) - timedelta(microseconds=1)

        filtered_gps_data = gps_data.filter(
            timestamp__range=(start_date_obj, end_date_obj)
        )

        if (filtered_gps_data.count() == 0):
            return JsonResponse({
                'success': True,
                'data': filtered_data,
                'message': 'No Data Found!!'
            })
        else:
            a = 1
            for data in filtered_gps_data:
                filtered_data.append({
                    'id': a,
                    'device_id': data.device_id,
                    'vehicle_number': data.vehicle_number,
                    'timestamp': data.timestamp,
                    'latitude': data.latitude,
                    'longitude': data.longitude,
                    'speed': data.speed,
                })
                a += 1

            return JsonResponse({
                'success': True,
                'data': filtered_data,
                'message': 'Data Fetch Successful!!'
            })

    except Exception as e:
        print('Exception : ', e)
        return JsonResponse({
            'success': False,
            'data': filtered_data,
            'message': 'Error Fetching Data!!'
        }, status=200)


@csrf_exempt
def get_vehicle_numbers(request):
    vehicle_numbers = []

    if (request.method != 'GET'):
        return JsonResponse({
            'success': False,
            'message': 'Invalid Request',
            'data': vehicle_numbers,
        }, status=400)

    try:
        if request.session.get('credential') is None or request.session.get('role') != 'customer':
            return JsonResponse({
                'success': False,
                'message': 'User Not Logged In!!',
                'data': vehicle_numbers,
            }, status=400)

        customer = Customer.objects.get(
            phone=request.session.get('credential'))

        vehicle_numbers = customer.vehicles

        return JsonResponse({
            'success': True,
            'data': vehicle_numbers,
            'message': 'Vehicle Numbers Fetched Successfully!!'
        })

    except Exception as e:
        print('Exception : ', e)
        return JsonResponse({
            'success': False,
            'data': vehicle_numbers,
            'message': 'Error Fetching Vehicle Numbers!!'
        }, status=200)


@csrf_exempt
def get_user_role(request):
    if (request.method != 'GET'):
        return JsonResponse({
            'success': False,
            'message': 'Invalid Request'
        }, status=400)

    try:
        if request.session.get('credential') is None:
            return JsonResponse({
                'success': False,
                'role': None
            })

        return JsonResponse({
            'success': True,
            'role': request.session.get('role')
        })

    except Exception as e:
        print('Exception : ', e)
        return JsonResponse({
            'success': False,
            'data': None,
            'message': 'Error Fetching User Role!!'
        }, status=200)


@csrf_exempt
def logout(request):
    if (request.method != 'GET'):
        return JsonResponse({
            'success': False,
            'message': 'Invalid Request'
        }, status=400)

    try:
        del request.session['credential']
        del request.session['role']
        request.session.flush()

        return JsonResponse({
            'success': True,
            'message': 'Logged Out Successfully!!'
        })
    except Exception as e:
        print('Exception : ', e)
        return JsonResponse({
            'success': False,
            'message': 'Error Logging Out!!'
        }, status=200)


@csrf_exempt
def add_dataStore(request):
    if (request.method != 'POST'):
        return JsonResponse({
            'success': False,
            'message': 'Invalid Request'
        }, status=400)

    if request.session.get('credential') is None or request.session.get('role') != 'admin':
        return JsonResponse({
            'success': False,
            'message': 'Admin Not Logged In!!',
        }, status=400)

    try:
        postData = json.loads(request.body)
        precision = 5

        latitude = float(postData['latitude'])
        longitude = float(postData['longitude'])
        speed = float(postData['speedLimit'])
        police_station_contact = postData['nearByPoliceStation']
        ambulance_contact = postData['nearByAmbulance']

        if DataStore.objects.filter(latitude=latitude, longitude=longitude).exists():
            return JsonResponse({
                'success': False,
                'message': 'Data Already Exists for this Location!!',
            })

        data_store = DataStore(
            latitude=latitude,
            longitude=longitude,
            speed=speed,
            police_station_contact=police_station_contact,
            ambulance_contact=ambulance_contact
        )

        data_store.save()

        return JsonResponse({
            'success': True,
            'message': 'Data Saved Successfully!!',
            'original_id': data_store.pk
        })

    except Exception as e:
        print('Exception : ', e)
        return JsonResponse({
            'success': False,
            'message': 'Error Saving Data!!',
        }, status=200)


@csrf_exempt
def update_dataStore(request):

    if (request.method != 'POST'):
        return JsonResponse({
            'success': False,
            'message': 'Invalid Request'
        }, status=400)

    if request.session.get('credential') is None or request.session.get('role') != 'admin':
        return JsonResponse({
            'success': False,
            'message': 'Admin Not Logged In!!',
        }, status=400)

    try:
        postData = json.loads(request.body)
        precision = 5

        original_id = postData['originalID']
        latitude = float(postData['latitude'])
        longitude = float(postData['longitude'])
        speed = float(postData['speedLimit'])
        police_station_contact = postData['nearByPoliceStation']
        ambulance_contact = postData['nearByAmbulance']

        data_store = DataStore.objects.get(pk=original_id)
        old_latitude = data_store.latitude
        old_longitude = data_store.longitude

        if DataStore.objects.filter(latitude=latitude, longitude=longitude).exists() and (old_latitude != latitude or old_longitude != longitude):
            return JsonResponse({
                'success': False,
                'message': 'Data Already Exists for this Location!!',
            })

        else:
            DataStore.objects.filter(pk=original_id).update(
                latitude=latitude,
                longitude=longitude,
                speed=speed,
                police_station_contact=police_station_contact,
                ambulance_contact=ambulance_contact
            )

            return JsonResponse({
                'success': True,
                'message': 'Data Updated Successfully!!',
            })

    except Exception as e:
        print('Exception : ', e)
        return JsonResponse({
            'success': False,
            'message': 'Error Updating Data!!',
        }, status=200)


@csrf_exempt
def get_dataStore(request):
    data_store = []

    if (request.method != 'GET'):
        return JsonResponse({
            'success': False,
            'message': 'Invalid Request',
            'data': data_store,
        }, status=400)

    try:
        if request.session.get('credential') is None or request.session.get('role') != 'admin':
            return JsonResponse({
                'success': False,
                'message': 'Admin Not Logged In!!',
                'data': data_store,
            }, status=400)

        data_store = DataStore.objects.all()

        res_data = []

        a = 1
        for item in data_store:
            res_data.append({
                'id': a,
                'original_id': item.pk,
                'latitude': item.latitude,
                'longitude': item.longitude,
                'speed_limit': item.speed,
                'nearby_police_station': item.police_station_contact,
                'nearby_ambulance': item.ambulance_contact
            })

            a += 1

        return JsonResponse({
            'success': True,
            'data': res_data,
            'message': 'Data Fetched Successfully!!'
        })

    except Exception as e:
        print('Exception : ', e)
        return JsonResponse({
            'success': False,
            'data': list(data_store.values()),
            'message': 'Error Fetching Data!!'
        }, status=200)


@csrf_exempt
def delete_dataStore(request):
    if (request.method != 'DELETE'):
        return JsonResponse({
            'success': False,
            'message': 'Invalid Request'
        }, status=400)

    if request.session.get('credential') is None or request.session.get('role') != 'admin':
        return JsonResponse({
            'success': False,
            'message': 'Admin Not Logged In!!',
        }, status=400)

    try:
        deleteData = json.loads(request.body)
        original_id = deleteData['original_id']

        data_store = DataStore.objects.filter(pk=original_id)
        data_store.delete()

        return JsonResponse({
            'success': True,
            'message': 'Data Deleted Successfully!!',
        })

    except Exception as e:
        print('Exception : ', e)
        return JsonResponse({
            'success': False,
            'message': 'Error Deleting Data!!',
        }, status=200)


# -----------------------------------------------------------------------------------------------#

@csrf_exempt
def add_dataStoreSegment(request):
    if (request.method != 'POST'):
        return JsonResponse({
            'success': False,
            'message': 'Invalid Request'
        }, status=400)

    if request.session.get('credential') is None or request.session.get('role') != 'admin':
        return JsonResponse({
            'success': False,
            'message': 'Admin Not Logged In!!',
        }, status=400)

    try:
        postData = json.loads(request.body)
        precision = 5

        start_latitude = float(postData['startLatitude'])
        start_longitude = float(postData['startLongitude'])
        end_latitude = float(postData['endLatitude'])
        end_longitude = float(postData['endLongitude'])
        speed = float(postData['speedLimit'])
        police_station_contact = postData['nearByPoliceStation']
        ambulance_contact = postData['nearByAmbulance']

        data_points = postData['dataPoints']

        if DataStoreSegment.objects.filter(start_latitude=start_latitude, start_longitude=start_longitude, end_latitude=end_latitude, end_longitude=end_longitude).exists():
            return JsonResponse({
                'success': False,
                'message': 'Data Already Exists for this Location!!',
            })

        data_store_segment = DataStoreSegment(
            start_latitude=start_latitude,
            start_longitude=start_longitude,
            end_latitude=end_latitude,
            end_longitude=end_longitude,
            speed=speed,
            police_station_contact=police_station_contact,
            ambulance_contact=ambulance_contact,
        )

        data_store_segment.save()

        data_store_data = []

        # The below loop will save only 10% of the data points

        step = len(data_points)//10 if len(data_points) > 100 else 1
        data_points_summarized = data_points[::step]

        for data in data_points_summarized:
            data_store = DataStore(
                latitude=data['lat'],
                longitude=data['lng'],
                speed=speed,
                police_station_contact=police_station_contact,
                ambulance_contact=ambulance_contact,
                segment=data_store_segment
            )

            data_store.save()
            data_store_data.append(data_store)

        data_store_segment.data_points.set(data_store_data)
        
        data_points = data_points_summarized
        middle_ind = len(data_points)//2
            
        next_point = {}
        if(len(data_points)>middle_ind+2):
            next_point = data_points[middle_ind+2]
        elif(len(data_points)>middle_ind-2):
            next_point = data_points[middle_ind-2]
        else:
            next_point = data_points[middle_ind]
            
            
        return JsonResponse({
            'success': True,
            'message': 'Data Saved Successfully!!',
            'original_id': data_store_segment.pk,
            'middle_point': {
                'latitude': data_points_summarized[len(data_points_summarized)//2]['lat'],
                'longitude': data_points_summarized[len(data_points_summarized)//2]['lng'],
            },
            'next_point': {
                'latitude': next_point['lat'],
                'longitude': next_point['lng'],   
            }
        })

    except Exception as e:
        print('Exception : ', e)
        return JsonResponse({
            'success': False,
            'message': 'Error Saving Data!!',
        }, status=200)


@csrf_exempt
def update_dataStoreSegment(request):
    if (request.method != 'POST'):
        return JsonResponse({
            'success': False,
            'message': 'Invalid Request'
        }, status=400)

    if request.session.get('credential') is None or request.session.get('role') != 'admin':
        return JsonResponse({
            'success': False,
            'message': 'Admin Not Logged In!!',
        }, status=400)

    try:
        postData = json.loads(request.body)
        original_id = postData['originalID']
        speed = float(postData['speedLimit'])
        police_station_contact = postData['nearByPoliceStation']
        ambulance_contact = postData['nearByAmbulance']

        data_store_segment = DataStoreSegment.objects.get(pk=original_id)
        data_store_segment.speed = speed
        data_store_segment.police_station_contact = police_station_contact
        data_store_segment.ambulance_contact = ambulance_contact

        DataStore.objects.filter(segment=data_store_segment).update(
            speed=speed,
            police_station_contact=police_station_contact,
            ambulance_contact=ambulance_contact
        )

        data_store_segment.save()

        return JsonResponse({
            'success': True,
            'message': 'Data Updated Successfully!!',
        })

    except Exception as e:
        print('Exception : ', e)
        return JsonResponse({
            'success': False,
            'message': 'Error Updating Data!!',
        }, status=200)


@csrf_exempt
def get_dataStoreSegment(request):
    data_store = []

    if (request.method != 'GET'):
        return JsonResponse({
            'success': False,
            'message': 'Invalid Request',
            'data': data_store,
        }, status=400)

    try:
        if request.session.get('credential') is None or request.session.get('role') != 'admin':
            return JsonResponse({
                'success': False,
                'message': 'Admin Not Logged In!!',
                'data': data_store,
            }, status=400)

        data_store_segments = DataStoreSegment.objects.all()

        res_data = []

        a = 1
        for item in data_store_segments:
            data_points = list(item.data_points.all())
            middle_point = data_points[len(data_points)//2]
            middle_ind = len(data_points)//2
            
            next_point = {}
            if(len(data_points)>middle_ind+2):
                next_point = data_points[middle_ind+2]
            elif(len(data_points)>middle_ind-2):
                next_point = data_points[middle_ind-2]
            else:
                next_point = data_points[middle_ind]
            
            
            res_data.append({
                'id': a,
                'original_id': item.pk,
                'start_latitude': item.start_latitude,
                'start_longitude': item.start_longitude,
                'end_latitude': item.end_latitude,
                'end_longitude': item.end_longitude,
                'speed_limit': item.speed,
                'nearby_police_station': item.police_station_contact,
                'nearby_ambulance': item.ambulance_contact,
                'middle_point': {
                    'latitude': middle_point.latitude,
                    'longitude': middle_point.longitude,
                },
                'next_point': {
                    'latitude': next_point.latitude,
                    'longitude': next_point.longitude,
                }
            })

            a += 1
            
        return JsonResponse({
            'success': True,
            'data': res_data,
            'message': 'Data Fetched Successfully!!'
        })

    except Exception as e:
        print('Exception : ', e)
        return JsonResponse({
            'success': False,
            'data': list(data_store.values()),
            'message': 'Error Fetching Data!!'
        }, status=200)


@csrf_exempt
def delete_dataStoreSegment(request):
    if (request.method != 'DELETE'):
        return JsonResponse({
            'success': False,
            'message': 'Invalid Request'
        }, status=400)

    if request.session.get('credential') is None or request.session.get('role') != 'admin':
        return JsonResponse({
            'success': False,
            'message': 'Admin Not Logged In!!',
        }, status=400)

    try:
        deleteData = json.loads(request.body)
        original_id = deleteData['original_id']

        data_store_segments = DataStoreSegment.objects.filter(pk=original_id)

        data_store_segment = data_store_segments[0]

        DataStore.objects.filter(segment=data_store_segment).delete()

        data_store_segment.delete()

        return JsonResponse({
            'success': True,
            'message': 'Data Deleted Successfully!!',
        })

    except Exception as e:
        print('Exception : ', e)
        return JsonResponse({
            'success': False,
            'message': 'Error Deleting Data!!',
        }, status=200)
