import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: JSON.parse(localStorage.getItem('vstore_user')) || null,
    token: localStorage.getItem('vstore_token') || null,
    isAuthenticated: !!localStorage.getItem('vstore_token'),
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem('vstore_user', JSON.stringify(action.payload.user));
            localStorage.setItem('vstore_token', action.payload.token);
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('vstore_user');
            localStorage.removeItem('vstore_token');
        },
        clearAuthError: (state) => {
            state.error = null;
        }
    }
});

export const { loginStart, loginSuccess, loginFailure, logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
