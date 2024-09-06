import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const createPaymentAccount = createAsyncThunk(
    'createAccountLink/createPaymentAccount',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { signUpToken } = getState().setToken;
            const data = await makeRequest('POST', `/payments/create-account-link`, null, null, signUpToken);
            return data;
        } catch (error) {
            return error;
        }
    }
);

const createAccountLinkSlice = createSlice({
    name: 'createAccountLink',
    initialState: {
        response: null,
        error: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPaymentAccount.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(createPaymentAccount.fulfilled, (state, action) => {
                state.error = null;
                state.response = action.payload;
                state.status = 'succeeded';
            })
            .addCase(createPaymentAccount.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default createAccountLinkSlice.reducer;


