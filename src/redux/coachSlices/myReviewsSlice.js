import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const fetchMyReviews = createAsyncThunk(
    'myReviews/fetchMyReviews',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().userLogin
            const data = await makeRequest('GET', `/rating/getAllByCoach/${payload?.user_id}`, null, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const myReviewsSliceSlice = createSlice({
    name: 'myReviews',
    initialState: {
        reviewsList: null,
        error: null,
        status: 'idle',
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyReviews.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(fetchMyReviews.fulfilled, (state, action) => {
                state.error = null;
                state.reviewsList = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchMyReviews.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default myReviewsSliceSlice.reducer;


