import { createSlice } from "@reduxjs/toolkit";

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    dashboardview: false,
    userview: false,
    uservalues: {
      usernameoremailid: "",
    },
    currentview: {
      deviceregistry: true,
      searchdevices: false,
      dataentry: false,
    },
  },
  reducers: {
    viewdashboard: (state, action) => {
      state.dashboardview = action.payload.dashboardview;
    },
    updateadmin: (state, action) => {
      state.uservalues = {
        ...state.uservalues,
        usernameoremailid: action.payload.usernameoremailid,
      };
      
    },
    updatecurrentview: (state, action) => {
      state.currentview = {
        ...state.currentview,
        deviceregistry: action.payload.deviceregistry,
        searchdevices: action.payload.searchdevices,
        dataentry: action.payload.dataentry,
      };
    },
    viewuserdashboard: (state, action) => {
      state.userview = action.payload.userview;
    },
  },
});

export const {
  viewdashboard,
  updateadmin,
  updatecurrentview,
  viewuserdashboard,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
