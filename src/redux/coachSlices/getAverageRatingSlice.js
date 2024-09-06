import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const fetchAverageRating = createAsyncThunk(
    'averageRating/fetchAverageRating',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().userLogin
            const data = await makeRequest('GET', `/rating/getAverageRatingForCoach?coach_id=${payload?.user_id}`, null, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const getAverageRatingSlice = createSlice({
    name: 'averageRating',
    initialState: {
        response: null,
        error: null,
        status: 'idle',
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAverageRating.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(fetchAverageRating.fulfilled, (state, action) => {
                state.error = null;
                state.response = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchAverageRating.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default getAverageRatingSlice.reducer;


