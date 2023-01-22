import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    token: null,
    userDetails: null,
}

const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers:{
        login(state, {payload}) {
            state.userDetails = payload;
            state.token = payload.token;
            localStorage.setItem("token", payload.token);
        },
        logout( state ) {
            state.userDetails = null;
            state.token = null;
            localStorage.removeItem("token");
        },
    }
})

const { actions, reducer } = userSlice;

export const { login, logout } = actions;

export default reducer;