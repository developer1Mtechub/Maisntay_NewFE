import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const verifyAccountStatus = createAsyncThunk(
    'verifyStripeAccount/verifyAccountStatus',
    async (payload, { getState, rejectWithValue }) => {
        try {
            // const { signUpToken } = getState().setToken;
            const data = await makeRequest('GET', `/payments/check-verification-status?accountId=${payload?.account_id}`, null, null, null);
            return data;
        } catch (error) {
            return error;
        }
    }
);

const verifyAccountStatusSlice = createSlice({
    name: 'verifyStripeAccount',
    initialState: {
        response: null,
        error: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(verifyAccountStatus.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(verifyAccountStatus.fulfilled, (state, action) => {
                state.error = null;
                state.response = action.payload;
                state.status = 'succeeded';
            })
            .addCase(verifyAccountStatus.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default verifyAccountStatusSlice.reducer;


