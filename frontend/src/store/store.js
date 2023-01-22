import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../js/slices/user_slice";
import authApi from "../js/slices/api_slices/auth_api";
import merchantApi from "../js/slices/api_slices/merchant_api";

const store = configureStore({
   reducer:{
    user: userReducer,
    [authApi.reducerPath]:authApi.reducer,
    [merchantApi.reducerPath]: merchantApi.reducer,
   },
   middleware:(getDefaultMiddleware)=> getDefaultMiddleware()
   .concat(authApi.middleware)
   .concat(merchantApi.middleware),
})

export default store;