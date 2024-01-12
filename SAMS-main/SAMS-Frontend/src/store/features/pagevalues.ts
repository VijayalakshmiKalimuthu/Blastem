import { createSlice } from "@reduxjs/toolkit";

export const pagevaluesSlice = createSlice({
  name: "pagevalues",
  initialState: {
    login: true,
    forgotpass: false,
    register: true,
    customer: false,
  },
  reducers: {
    viewloginpage: (state, action) => {
      state.login = action.payload.login;
      state.forgotpass = action.payload.forgotpass;
      state.register = action.payload.register;
      state.customer = action.payload.customer;
    },
    viewforgotpass: (state, action) => {
      state.login = action.payload.login;
      state.forgotpass = action.payload.forgotpass;
      state.register = action.payload.register;
    },
    viewregisterpage: (state, action) => {
      state.login = action.payload.login;
      state.forgotpass = action.payload.forgotpass;
      state.register = action.payload.register;
    },
    viewcustomerpage: (state, action) => {
      state.customer = action.payload.customer;
      state.login = action.payload.login;
      state.register = action.payload.register;
      state.forgotpass = action.payload.forgotpass;
    },
  },
});

export const {
  viewloginpage,
  viewforgotpass,
  viewregisterpage,
  viewcustomerpage,
} = pagevaluesSlice.actions;

export default pagevaluesSlice.reducer;
