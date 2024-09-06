// slices/sendVerificationCodeSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const fetchSessionDurations = createAsyncThunk(
    'durations/fetchSessionDurations',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().userLogin;
            console.log('payload.coachId',payload.coachId)
            const data = await makeRequest('GET', `/duration/get/${payload.coachId}`, null, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const getDurationSlice = createSlice({
    name: 'durations',
    initialState: {
        durations: null,
        error: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSessionDurations.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(fetchSessionDurations.fulfilled, (state, action) => {
                state.error = null;
                state.durations = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchSessionDurations.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default getDurationSlice.reducer;


