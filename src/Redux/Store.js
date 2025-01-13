import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Reducers/UserSlice"
import currentOrderReducer from "./Reducers/CurrentOrderSlice"



export const store = configureStore({
    reducer:{
        user:userReducer,
        currentOrder:currentOrderReducer
       
    }
})