import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const fetchCoachBadge = createAsyncThunk(
    'coachBadgeDetail/fetchCoachBadge',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().userLogin
            const data = await makeRequest('GET', `/rating/getCoachBadges/${payload?.user_id}`, null, null, token);
            return data;
        } catch (error) {
            return error;
        }
    }
);

const getCoachBadgeSlice = createSlice({
    name: 'coachBadgeDetail',
    initialState: {
        response: null,
        error: null,
        status: 'idle',
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoachBadge.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(fetchCoachBadge.fulfilled, (state, action) => {
                state.error = null;
                state.response = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchCoachBadge.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default getCoachBadgeSlice.reducer;


