// slices/sendVerificationCodeSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const fetchNotification = createAsyncThunk(
    'fetchNotification/fetchNotification',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { role, user_id } = getState().userLogin;
            const data = await makeRequest('GET', `/notifications/getAll?${role}_id=${user_id}`, null, null, null);
            return data;
        } catch (error) {
            return error;
        }
    }
);

const getNotificationByUserSlice = createSlice({
    name: 'fetchNotification',
    initialState: {
        notifications: null,
        error: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotification.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(fetchNotification.fulfilled, (state, action) => {
                state.error = null;
                state.notifications = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchNotification.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default getNotificationByUserSlice.reducer;


