import { createSlice } from "@reduxjs/toolkit";

export interface themeState {
    status : "Dark" | "Light"
}

const initialState: themeState = {
    status : "Light"
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers:{
        toggleTheme : (state) => {
            state.status = state.status === "Light" ? "Dark" : "Light";
        }
    }
}); 

export const {toggleTheme} = themeSlice.actions;

export default themeSlice.reducer;