import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface authState {
    token : string;
    logedinStatus: boolean;
}

const initialState:authState = {
    token : "",
    logedinStatus : false
};

export const authSlice = createSlice({
    name : "auth",
    initialState ,
    reducers: {
        setToken : (state,action:PayloadAction<string>) => {
            if (typeof state === 'object') {
                state.token = action.payload;
                state.logedinStatus = true;
            }
        },
        removeToken : (state) => {
            state.token = "";
            state.logedinStatus = false;
        }
    }
});

export const {setToken,removeToken} = authSlice.actions;

export default authSlice.reducer;