import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const fetchCoachHomeSessions = createAsyncThunk(
    'coachHomeSessions/fetchCoachHomeSessions',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().userLogin;
            const { status } = payload;
            const data = await makeRequest('GET', `/session/get-by-coach?status=${payload?.status}`, null, null, token);
            return { status, data }; // Return status along with data
            //return data;
        } catch (error) {
            return error
        }
    }
);

const coachHomeSessionSlice = createSlice({
    name: 'coachHomeSessions',
    initialState: {
        upcomingSessions: null,
        completedSessions: null,
        error: null,
        status: 'idle',
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoachHomeSessions.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(fetchCoachHomeSessions.fulfilled, (state, action) => {
                const { status, data } = action.payload;
                state.error = null;
                // if (status === '') {
                //     state.upcomingSessions = data;
                // } else if (status === 'completed') {
                //     state.completedSessions = data;
                // }
                if (status === 'pending') {
                    state.upcomingSessions = data;
                } else if (status === 'paid') {
                    state.completedSessions = data;
                }
                state.status = 'succeeded';
            })
            .addCase(fetchCoachHomeSessions.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default coachHomeSessionSlice.reducer;


