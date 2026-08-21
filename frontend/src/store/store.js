import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/authSlice";
import locationSlice from "../features/locationSlice";

const store = configureStore({
    reducer: {
        auth: authSlice.reducer, 
        location: locationSlice.reducer, 
    }
    
})

export default store