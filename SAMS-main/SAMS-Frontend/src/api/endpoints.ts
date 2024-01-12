import axios from "axios";

export interface DeviceData {
  vehicle_number: string;
  device_id: string;
  name: string;
  address: string;
  state: string;
  city: string;
  pincode: string;
  phone: string;
}

export interface DeviceRegistryData {
  id: number;
  original_id: number;
  device_id: string;
  vehicle_number: string;
  name: string;
  address: string;
  state: string;
  city: string;
  pincode: string;
  phone: string;
  emergency_contact_1: string;
  emergency_contact_2: string;
  tyre_size: string;
  pulses: number;
}

export interface FilterData {
  id: number;
  device_id: string;
  vehicle_number: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  speed: number;
}

export interface gpsDataModel {
  id: number;
  device_id: string;
  vehicle_number: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  speed: number;
}

export interface DataStoreSegment {
  id: number;
  original_id: number;
  start_latitude: number;
  start_longitude: number;
  end_latitude: number;
  end_longitude: number;
  speed_limit: number;
  nearby_police_station: string;
  nearby_ambulance: string;
  middle_point: {
    latitude: number;
    longitude: number;
  };
  next_point: {
    latitude: number;
    longitude: number;
  };
}

export interface ServerResponse {
  success: boolean;
  message: string;
  username: string;
}

class AppService {
  // API_URL = "http://localhost:8000";
  API_URL = "http://43.231.127.246:8000";

  async loginAsAdmin(credential: string, password: string) {
    const type = credential.includes("@") ? "email" : "username";

    const postData = {
      credential: type === "email" ? credential.toLowerCase() : credential,
      password: password,
      type: type,
    };

    return await this.callPostAPI("login_admin", postData);
  }

  async register(username: string, email: string, password: string) {
    const postData = {
      username: username,
      password: password,
      email: email.toLowerCase(),
    };

    return await this.callPostAPI("register", postData);
  }

  async sendOTP(action: string, username: string, email: string) {
    const postData = {
      action: action,
      username: username,
      email: email.toLowerCase(),
    };

    return await this.callPostAPI("send_otp", postData);
  }

  async verifyCredential(type: string, credential: string) {
    const postData = {
      type: type,
      credential: credential,
    };

    return await this.callPostAPI("verify_credential", postData);
  }

  async resetPassword(email: string, newPassword: string) {
    const postData = {
      email: email,
      new_password: newPassword,
    };

    return await this.callPostAPI("reset_password", postData);
  }

  async sendLoginOTP(phone: string) {
    const postData = {
      phone: phone,
    };

    return await this.callPostAPI("send_login_otp", postData);
  }

  async loginAsUser(phone: string) {
    const postData = {
      phone: phone,
    };

    return await this.callPostAPI("login_user", postData);
  }

  async getVehicleNumbers() {
    return await this.callGetAPI("get_vehicle_numbers");
  }

  async registerDevice(deviceData: DeviceData) {
    return await this.callPostAPI("register_device", deviceData);
  }

  async updateDevice(deviceData: DeviceRegistryData) {
    return await this.callPostAPI("update_device", deviceData);
  }

  async deleteDevice(original_id: number, vehicle_number: string) {
    const postData = {
      original_id: original_id,
      vehicle_number: vehicle_number,
    };

    return await this.callDeleteAPI("delete_device", postData);
  }

  async filterDevice(
    vehicle_number: string,
    device_id: string,
    start_date: string,
    end_date: string
  ) {
    const postData = {
      vehicle_number: vehicle_number,
      device_id: device_id,
      start_date: start_date,
      end_date: end_date,
    };
    return await this.callPostAPI("filter_device_data", postData);
  }

  async getDeviceRegistry() {
    return await this.callGetAPI("get_device_registry");
  }

  async getUserRole() {
    return await this.callGetAPI("get_user_role");
  }

  async addDataStore(postData: {
    latitude: number;
    longitude: number;
    speedLimit: number;
    nearByPoliceStation: string;
    nearByAmbulance: string;
  }) {
    return await this.callPostAPI("add_dataStore", postData);
  }

  async updateDataStore(postData: {
    originalID: number;
    address: string;
    latitude: number;
    longitude: number;
    speedLimit: number;
    nearByPoliceStation: string;
    nearByAmbulance: string;
  }) {
    return await this.callPostAPI("update_dataStore", postData);
  }

  async getDataStore() {
    return await this.callGetAPI("get_dataStore");
  }

  async deleteDataStore(originalID: number) {
    const deleteData = {
      original_id: originalID,
    };
    return await this.callDeleteAPI("delete_dataStore", deleteData);
  }

  async addDataStoreSegment(data: {
    startLatitude: number;
    startLongitude: number;
    endLatitude: number;
    endLongitude: number;
    speedLimit: number;
    nearByPoliceStation: string;
    nearByAmbulance: string;
    dataPoints: {
      lat: number;
      lng: number;
    }[];
  }) {
    return await this.callPostAPI("add_dataStoreSegment", data);
  }

  async updateDataStoreSegment(data: {
    originalID: number;
    speedLimit: number;
    nearByPoliceStation: string;
    nearByAmbulance: string;
  }) {
    console.log(data);
    return await this.callPostAPI("update_dataStoreSegment", data);
  }

  async getDataStoreSegment() {
    return await this.callGetAPI("get_dataStoreSegment");
  }

  async deleteDataStoreSegment(originalID: number) {
    const deleteData = {
      original_id: originalID,
    };
    return await this.callDeleteAPI("delete_dataStoreSegment", deleteData);
  }

  async logout() {
    return await this.callGetAPI("logout");
  }

  // ------------------------- Helper Functions ------------------------- //

  async callPostAPI(url: string, postData: any): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}/${url}`, postData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error in API call:", error);
      return {
        success: false,
        message: "An error occurred while communicating with the server.",
      };
    }
  }

  async callGetAPI(url: string): Promise<any> {
    try {
      const response = await axios.get(`${this.API_URL}/${url}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error in API call:", error);
      return {
        success: false,
        message: "An error occurred while communicating with the server.",
      };
    }
  }

  async callDeleteAPI(url: string, postData: any): Promise<any> {
    try {
      const response = await axios.delete(`${this.API_URL}/${url}`, {
        data: postData,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error in API call:", error);
      return {
        success: false,
        message: "An error occurred while communicating with the server.",
      };
    }
  }
}

const appService = new AppService();
export default appService;
