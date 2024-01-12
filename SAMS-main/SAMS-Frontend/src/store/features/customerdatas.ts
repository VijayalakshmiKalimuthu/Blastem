import { createSlice } from "@reduxjs/toolkit";

export const customersdataSlice = createSlice({
  name: "customersdata",
  initialState: {
    customersdata: [{ id: 0, original_id: 0, vehicle_number: "" }],
  },
  reducers: {
    updatecustomerdata: (state, action) => {
      state.customersdata = action.payload.customersdata;
    },
    addcustomerdata: (state, action) => {
      state.customersdata = [
        ...state.customersdata,
        {
          ...action.payload.customersdata,
          id: state.customersdata.length + 1,
          original_id: action.payload.original_id,
        },
      ];
    },
    editcustomerdata: (state, action) => {
      const tobeupda = state.customersdata.map((customer) => {
        if (customer.original_id === action.payload.orgid) {
          return {
            ...customer,
            ...action.payload.customersdata,
          };
        } else {
          return customer;
        }
      });
      state.customersdata = tobeupda;
    },
    deletecustomerdata: (state, action) => {
      let id = 1;
      const finalarray = state.customersdata
        .filter((customer) => {
          return (
            customer.original_id !== action.payload.id &&
            customer.vehicle_number !== action.payload.vehicle_number
          );
        })
        .map((returns) => {
          return { ...returns, id: id++ };
        });
      state.customersdata = finalarray;
    },
  },
});
export const {
  updatecustomerdata,
  addcustomerdata,
  editcustomerdata,
  deletecustomerdata,
} = customersdataSlice.actions;
export default customersdataSlice.reducer;
