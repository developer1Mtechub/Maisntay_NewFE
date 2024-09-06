import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const withDrawAmount = createAsyncThunk(
    'withDrawAmount/withDrawAmount',
    async (payload, { getState, rejectWithValue }) => {
        try {
            // const { signUpToken } = getState().setToken;
            const data = await makeRequest('POST', `/payments/withdraw`, payload, null, null);
            return data;
        } catch (error) {
            return error;
        }
    }
);

const withDrawAmountSlice = createSlice({
    name: 'withDrawAmount',
    initialState: {
        response: null,
        error: null,
        status: 'idle',
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(withDrawAmount.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(withDrawAmount.fulfilled, (state, action) => {
                state.error = null;
                state.response = action.payload;
                state.status = 'succeeded';
            })
            .addCase(withDrawAmount.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default withDrawAmountSlice.reducer;


