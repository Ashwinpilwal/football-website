import { createSlice } from "@reduxjs/toolkit";

const locationSlice = createSlice({
    name: "location",

    initialState:{
        longitude: null,
        latitude: null
    },

    reducers:{
        setUserLocation : (state, action) => {
            state.longitude = action.payload.longitude
            state.latitude = action.payload.latitude
        }
    }

})

export const {setUserLocation} = locationSlice.actions
export default locationSlice