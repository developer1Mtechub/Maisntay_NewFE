// slices/sendVerificationCodeSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const postSessionsDetails = createAsyncThunk(
    'postSessionDetail/postSessionsDetails',
    async (sessionPayload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().userLogin;
            const data = await makeRequest('POST', `/session/create`, sessionPayload, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const postCoachDetailSessionSlice = createSlice({
    name: 'postSessionDetail',
    initialState: {
        response: null,
        error: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(postSessionsDetails.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(postSessionsDetails.fulfilled, (state, action) => {
                state.error = null;
                state.response = action.payload;
                state.status = 'succeeded';
            })
            .addCase(postSessionsDetails.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default postCoachDetailSessionSlice.reducer;


