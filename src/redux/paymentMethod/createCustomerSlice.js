import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const createCustomer = createAsyncThunk(
    'createCustomer/createCustomer',
    async (payload, { getState, rejectWithValue }) => {
        try {
            // const { signUpToken } = getState().setToken;
            const data = await makeRequest('POST', `/payments/create-customer`, payload, null, null);
            return data;
        } catch (error) {
            return error;
        }
    }
);

const createCustomerSlice = createSlice({
    name: 'createCustomer',
    initialState: {
        response: null,
        error: null,
        status: 'idle',
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(createCustomer.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(createCustomer.fulfilled, (state, action) => {
                state.error = null;
                state.response = action.payload;
                state.status = 'succeeded';
            })
            .addCase(createCustomer.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default createCustomerSlice.reducer;


