// slices/sendVerificationCodeSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const deleteCoachAccount = createAsyncThunk(
    'deleteCoachAccount/deleteCoachAccount',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { role, user_id } = getState().userLogin;
            const data = await makeRequest('DELETE', `/users/delete-temp/${user_id}`, null, null, null);
            return data;
        } catch (error) {
            return error;
        }
    }
);

const deleteCoachAccountSlice = createSlice({
    name: 'deleteCoachAccount',
    initialState: {
        response: null,
        error: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(deleteCoachAccount.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(deleteCoachAccount.fulfilled, (state, action) => {
                state.error = null;
                state.response = action.payload;
                state.status = 'succeeded';
            })
            .addCase(deleteCoachAccount.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default deleteCoachAccountSlice.reducer;


