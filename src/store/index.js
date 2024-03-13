import { createSlice, configureStore } from "@reduxjs/toolkit";

let user = JSON.parse(sessionStorage.getItem('user'));
let isSignedIn = JSON.parse(sessionStorage.getItem('isLoggedIn'));
try {
 
    if (!isSignedIn) {
        isSignedIn = false;
    }
    if (!user) {
        user = null
    }
}
catch (err) {
    console.log('error in store', err)
}
const initialAuthState = {
    isLoggedIn: isSignedIn,
    currentUser: user,
};
// slice for auth state
const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        login(state, data) {
            // state.isLoggedIn;
            state.isLoggedIn = data.payload.isLoggedIn;
            state.currentUser = data.payload.currentUser;
        },
        logout(state) {
   
            sessionStorage.clear();
            state.isLoggedIn = false;
            state.currentUser = null;
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