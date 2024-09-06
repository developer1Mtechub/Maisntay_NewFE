// slices/sendVerificationCodeSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const fetchRatingBySession = createAsyncThunk(
    'ratingBySession/fetchRatingBySession',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().userLogin;
            const data = await makeRequest('GET', `/rating/getRatingBySession/${payload?.session_id}`, null, null, null);
            return data;
        } catch (error) {
            return error;
        }
    }
);

const getRatingBySessionSlice = createSlice({
    name: 'ratingBySession',
    initialState: {
        response: null,
        error: null,
        status: 'idle',
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRatingBySession.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(fetchRatingBySession.fulfilled, (state, action) => {
                state.error = null;
                state.response = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchRatingBySession.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default getRatingBySessionSlice.reducer;


