import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const fetchGraphData = createAsyncThunk(
    'graphData/fetchGraphData',
    async (payload, { getState, rejectWithValue }) => {
        try {
            // const { signUpToken } = getState().setToken;
            const data = await makeRequest('GET', `${payload?.end_point}${payload?.coach_id}`, null, null, null);
            return data;
        } catch (error) {
            return error;
        }
    }
);

const getGraphDataSlice = createSlice({
    name: 'graphData',
    initialState: {
        data: null,
        error: null,
        status: 'idle',
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGraphData.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(fetchGraphData.fulfilled, (state, action) => {
                state.error = null;
                state.data = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchGraphData.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default getGraphDataSlice.reducer;


