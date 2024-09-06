// slices/sendVerificationCodeSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const createNotification = createAsyncThunk(
    'createNotification/createNotification',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { role, user_id } = getState().userLogin;
            const data = await makeRequest('POST', `/notifications/create`, payload, null, null);
            return data;
        } catch (error) {
            return error;
        }
    }
);

const createNotificationSlice = createSlice({
    name: 'createNotification',
    initialState: {
        response: null,
        error: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(createNotification.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(createNotification.fulfilled, (state, action) => {
                state.error = null;
                state.response = action.payload;
                state.status = 'succeeded';
            })
            .addCase(createNotification.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default createNotificationSlice.reducer;


