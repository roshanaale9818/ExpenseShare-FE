import { createSlice, configureStore } from "@reduxjs/toolkit";

const initialAuthState = {
    isLoggedIn: false,
    currentUser: JSON.parse(sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')) : null,
};
// slice for auth state
const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        login(state,data) {
            // state.isLoggedIn;
            console.log("data in reducer",data)
            state.isLoggedIn =data.payload.isLoggedIn;
            state.currentUser = data.payload.currentUser;
        },
        logout(state) {
            state.isLoggedIn = false;
            state.currentUser=null;
            // sessionStorage.clear();
        }
    }
});
const store = configureStore({
    reducer: {
        auth: authSlice.reducer
    }
})


// actions for reducers methods
export const authActions = authSlice.actions;
export default store;