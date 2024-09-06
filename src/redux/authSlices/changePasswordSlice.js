// slices/emailVerificationSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const changePassword = createAsyncThunk(
    'changePassword/changePassword',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().userLogin
            const data = await makeRequest('PATCH', '/auth/changePassword', payload, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const changePasswordSlice = createSlice({
    name: 'changePassword',
    initialState: {
        response: null,
        error: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(changePassword.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                state.error = null;
                state.response = action.payload;
                state.status = 'succeeded';
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default changePasswordSlice.reducer;


