import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const updateAvailability = createAsyncThunk(
    'updateAvailabilitySection/updateAvailability',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().userLogin
            const data = await makeRequest('PUT', '/section/update', payload, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const updateAvailabilitySlice = createSlice({
    name: 'updateAvailabilitySection',
    initialState: {
        response: null,
        error: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateAvailability.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(updateAvailability.fulfilled, (state, action) => {
                state.error = null;
                state.response = action.payload;
                state.status = 'succeeded';
            })
            .addCase(updateAvailability.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default updateAvailabilitySlice.reducer;


