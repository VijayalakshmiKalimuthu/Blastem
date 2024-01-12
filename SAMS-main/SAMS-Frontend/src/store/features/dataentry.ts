import { createSlice } from "@reduxjs/toolkit";

export const dataentrySlice = createSlice({
  name: "dataentry",
  initialState: {
    value: [{ id: 0, original_id: 0 }],
  },
  reducers: {
    updategpsdata: (state, action) => {
      state.value = action.payload.value;
    },
    addgpsdata: (state, action) => {
      state.value = [
        ...state.value,
        {
          ...action.payload.value,
          id: state.value.length + 1,
        },
      ];
    },
    editgpsdata: (state, action) => {
      const tobeupda = state.value.map((customer) => {
        if (customer.id === action.payload.value.id) {
          return {
            ...action.payload.value,
          };
        } else {
          return customer;
        }
      });
      state.value = tobeupda;
    },
    deletegpsdata: (state, action) => {
      let id = 1;
      const finalarray = state.value
        .filter((customer) => {
          return customer.original_id !== action.payload.id;
        })
        .map((returns) => {
          return { ...returns, id: id++ };
        });
      state.value = finalarray;
    },
    resetgpsdata: (state) => {
      state.value = [{ id: 0, original_id: 0 }];
    },
  },
});

export const {
  updategpsdata,
  addgpsdata,
  editgpsdata,
  deletegpsdata,
  resetgpsdata,
} = dataentrySlice.actions;
export default dataentrySlice.reducer;
