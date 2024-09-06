import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const rateTheCoach = createAsyncThunk(
    'rateTheCoach/rateTheCoach',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().userLogin
            const data = await makeRequest('POST', '/rating/add', payload, null, token);
            return data;
        } catch (error) {
            return error;
        }
    }
);

const rateTheCoachSlice = createSlice({
    name: 'rateTheCoach',
    initialState: {
        response: null,
        error: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(rateTheCoach.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(rateTheCoach.fulfilled, (state, action) => {
                state.error = null;
                state.response = action.payload;
                state.status = 'succeeded';
            })
            .addCase(rateTheCoach.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default rateTheCoachSlice.reducer;


