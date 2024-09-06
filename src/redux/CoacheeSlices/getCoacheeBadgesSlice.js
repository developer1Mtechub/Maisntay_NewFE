// slices/sendVerificationCodeSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const fetchCoacheeBadges = createAsyncThunk(
    'fetchCoacheeBadges/fetchCoacheeBadges',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().userLogin;
            const data = await makeRequest('GET', `/rating/getCoacheeBadges`, null, null, token);
            return data;
        } catch (error) {
            return error;
        }
    }
);

const getCoacheeBadgesSlice = createSlice({
    name: 'fetchCoacheeBadges',
    initialState: {
        response: null,
        error: null,
        status: 'idle',
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoacheeBadges.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(fetchCoacheeBadges.fulfilled, (state, action) => {
                state.error = null;
                state.response = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchCoacheeBadges.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default getCoacheeBadgesSlice.reducer;


