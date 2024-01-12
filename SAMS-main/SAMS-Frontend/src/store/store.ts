import { configureStore } from "@reduxjs/toolkit";
import pagevaluesReducer from "./features/pagevalues";

import dashboardReducer from "./features/dashboard";
import customersdataReducer from "./features/customerdatas";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import persistsReducer from "./features/persists";
import dataentryReducer from "./features/dataentry";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const reducer = combineReducers({
  persists: persistsReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: {
    pagevalues: pagevaluesReducer,
    dashboard: dashboardReducer,
    customersdata: customersdataReducer,
    persists: persistedReducer,
    dataentry: dataentryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
