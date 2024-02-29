import { createSlice, configureStore } from "@reduxjs/toolkit";

const initialAuthState = {
    isLoggedIn:false,
    currentUser:JSON.parse(sessionStorage.getItem('user'))?JSON.parse(sessionStorage.getItem('user')):null,
};
// slice for auth state
const authSlice = createSlice({
    name:'auth',
    initialState:initialAuthState,
    reducers:{
        login(state){
            state.isLoggedIn = true;
        },
        logout(state){
            state.isLoggedIn=false;
        }
    }
});
const store = configureStore({
    reducer:{
        auth:authSlice.reducer
    }
})


// actions for reducers methods
export const authActions = authSlice.actions;
export default store;