import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const updateUpcomingSession = createAsyncThunk(
    'updateUpcomingSession/updateUpcomingSession',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().userLogin
            const newPayload = {
                status: "completed",
            }
            const data = await makeRequest('PUT', `/session/status-update/${payload?.session_id}`, newPayload, null, token);
            return data;
        } catch (error) {
            return error;
        }
    }
);

const updateUpcomingSessionsSlice = createSlice({
    name: 'updateUpcomingSession',
    initialState: {
        response: null,
        error: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateUpcomingSession.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(updateUpcomingSession.fulfilled, (state, action) => {
                state.error = null;
                state.response = action.payload;
                state.status = 'succeeded';
            })
            .addCase(updateUpcomingSession.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default updateUpcomingSessionsSlice.reducer;


