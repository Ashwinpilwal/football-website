import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: "auth",

    initialState: {
        status: false,
        userData: null,
        loading: true
    },

    reducers: {
        sliceLogin: (state, action) => {
            state.status = true;
            state.userData = action.payload?.user || action.payload?.userData || action.payload;
            state.loading = false;
        },
        sliceLogout: (state, action) => {
            state.status = false,
                state.userData = null
            state.loading = false
        },
        authChecking: (state) => {
            state.loading = true
        },
        updateLocationState: (state, action) => {
            if (state.userData) {
                state.userData = {
                    ...state.userData,
                    location: {
                        ...(state.userData.location || {}),
                        ...action.payload
                    }
                };
            }
        }
    }
})


export const { sliceLogin, sliceLogout, authChecking, updateLocationState } = authSlice.actions
export default authSlice