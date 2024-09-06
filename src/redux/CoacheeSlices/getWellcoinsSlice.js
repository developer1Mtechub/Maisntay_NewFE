// slices/sendVerificationCodeSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const fetchCoacheeWellcoins = createAsyncThunk(
    'coacheeWellcoins/fetchCoacheeWellcoins',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().userLogin;
            const data = await makeRequest('GET', `/rating/getCoacheeWellCoins?${payload?.limit !== '' ? `limit=${payload?.limit}` : ''}`, null, null, token);
            return data;
        } catch (error) {
            return error;
        }
    }
);

const getWellcoinsSlice = createSlice({
    name: 'coacheeWellcoins',
    initialState: {
        response: null,
        error: null,
        status: 'idle',
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoacheeWellcoins.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(fetchCoacheeWellcoins.fulfilled, (state, action) => {
                state.error = null;
                state.response = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchCoacheeWellcoins.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default getWellcoinsSlice.reducer;


