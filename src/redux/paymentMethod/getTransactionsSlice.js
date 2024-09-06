import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const fetchTransactions = createAsyncThunk(
    'transactions/fetchTransactions',
    async (payload, { getState, rejectWithValue }) => {
        try {
            // const { signUpToken } = getState().setToken;
            const data = await makeRequest('GET', `/payments/get-user-transactions/${payload?.coach_id}`, null, null, null);
            return data;
        } catch (error) {
            return error;
        }
    }
);

const getTransactionsSlice = createSlice({
    name: 'transactions',
    initialState: {
        transactions: null,
        error: null,
        status: 'idle',
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.error = null;
                state.transactions = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default getTransactionsSlice.reducer;


