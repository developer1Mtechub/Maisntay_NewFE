// slices/sendVerificationCodeSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const fetchSessionList = createAsyncThunk(
    'sessionList/fetchSessionList',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().userLogin;
            const data = await makeRequest('GET', `/session/get-by-${payload?.role}?status=${payload?.status}`, null, null, token);
            return data;
        } catch (error) {
            return error;
        }
    }
);

const getSessionListSlice = createSlice({
    name: 'sessionList',
    initialState: {
        sessionList: null,
        error: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSessionList.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(fetchSessionList.fulfilled, (state, action) => {
                state.error = null;
                state.sessionList = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchSessionList.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default getSessionListSlice.reducer;


