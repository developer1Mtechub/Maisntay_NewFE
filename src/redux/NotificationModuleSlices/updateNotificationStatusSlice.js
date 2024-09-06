// slices/sendVerificationCodeSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const updateNotificationStatus = createAsyncThunk(
    'updateNotification/updateNotificationStatus',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { role, user_id } = getState().userLogin;
            const key = `${role}Id`
            const payload = {
                [key]: user_id, // coach or coachee id
                is_read: true
            }
            console.log('payloadffffff',payload)
            const data = await makeRequest('PUT', `/notifications/updateByUser`, payload, null, null);
            return data;
        } catch (error) {
            return error;
        }
    }
);

const updateNotificationStatusSlice = createSlice({
    name: 'updateNotification',
    initialState: {
        notificationResponse: null,
        error: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateNotificationStatus.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(updateNotificationStatus.fulfilled, (state, action) => {
                state.error = null;
                state.notificationResponse = action.payload;
                state.status = 'succeeded';
            })
            .addCase(updateNotificationStatus.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default updateNotificationStatusSlice.reducer;


