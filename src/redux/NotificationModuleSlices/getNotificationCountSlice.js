// slices/sendVerificationCodeSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const getNotificationCount = createAsyncThunk(
    'notificationCount/getNotificationCount',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { role, user_id } = getState().userLogin;
            const data = await makeRequest('GET', `/notifications/getCount?${role}Id=${user_id}`, null, null, null);
            return data;
        } catch (error) {
            return error;
        }
    }
);

const getNotificationCountSlice = createSlice({
    name: 'notificationCount',
    initialState: {
        notificationCount: null,
        error: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNotificationCount.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(getNotificationCount.fulfilled, (state, action) => {
                state.error = null;
                state.notificationCount = action.payload;
                state.status = 'succeeded';
            })
            .addCase(getNotificationCount.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default getNotificationCountSlice.reducer;


