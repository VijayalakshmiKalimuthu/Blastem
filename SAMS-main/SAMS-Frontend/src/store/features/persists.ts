import { createSlice } from "@reduxjs/toolkit";

export const persistsSlice = createSlice({
  name: "persists",
  initialState: {
    value: {
      admindashboard: false,
      userdashboard: false,
      username: "",
    },
  },
  reducers: {
    viewadmindashboard: (state, action) => {
      state.value = {
        ...state.value,
        admindashboard: action.payload.admindashboard,
        username:action.payload.username
      };
    },
    viewuserdashboard: (state, action) => {
      state.value = {
        ...state.value,
        userdashboard: action.payload.userdashboard,
        username:action.payload.username
      };
    },
  },
});

export const { viewadmindashboard, viewuserdashboard } = persistsSlice.actions;
export default persistsSlice.reducer;
