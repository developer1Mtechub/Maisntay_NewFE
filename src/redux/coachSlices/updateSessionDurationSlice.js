import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const updateSessionDuration = createAsyncThunk(
    'updateSessionDurations/updateSessionDuration',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().userLogin
            const data = await makeRequest('PUT', '/section/update', payload, null, token);
            return data;
        } catch (error) {
            return error;
        }
    }
);

const updateSessionDurationsSlice = createSlice({
    name: 'updateSessionDurations',
    initialState: {
        response: null,
        error: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateSessionDuration.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(updateSessionDuration.fulfilled, (state, action) => {
                state.error = null;
                state.response = action.payload;
                state.status = 'succeeded';
            })
            .addCase(updateSessionDuration.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default updateSessionDurationsSlice.reducer;


