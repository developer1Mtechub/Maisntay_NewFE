import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const makePayment = createAsyncThunk(
    'makePayment/makePayment',
    async (payload, { getState, rejectWithValue }) => {
        try {
            // const { signUpToken } = getState().setToken;
            const data = await makeRequest('POST', `/payments/transfer-funds`, payload, null, null);
            return data;
        } catch (error) {
            return error;
        }
    }
);

const makePaymentSlice = createSlice({
    name: 'makePayment',
    initialState: {
        response: null,
        error: null,
        status: 'idle',
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(makePayment.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(makePayment.fulfilled, (state, action) => {
                state.error = null;
                state.response = action.payload;
                state.status = 'succeeded';
            })
            .addCase(makePayment.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default makePaymentSlice.reducer;


