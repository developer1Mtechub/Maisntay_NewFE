import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const fetchUpcomingAndCompleted = createAsyncThunk(
    'coacheeUpcomingAndCompleted/fetchUpcomingAndCompleted',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().userLogin;
            const data = await makeRequest('GET', `/session/get-by-${payload?.role}?status=${payload?.status}`, null, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const sessionAcceptRejectSlice = createSlice({
    name: 'coacheeUpcomingAndCompleted',
    initialState: {
        response: null,
        error: null,
        status: 'idle',
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUpcomingAndCompleted.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(fetchUpcomingAndCompleted.fulfilled, (state, action) => {
                state.error = null;
                state.response = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchUpcomingAndCompleted.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default sessionAcceptRejectSlice.reducer;


