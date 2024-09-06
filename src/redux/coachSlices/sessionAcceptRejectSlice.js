import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const postSessionStatus = createAsyncThunk(
    'sessionAcceptORReject/postSessionStatus',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().userLogin;
            const modifiedPayload = {
                status: payload?.status
            }
            const data = await makeRequest('PUT', `/session/status-update/${payload?.sessionId}`, modifiedPayload, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const sessionAcceptRejectSlice = createSlice({
    name: 'sessionAcceptORReject',
    initialState: {
        response: null,
        error: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(postSessionStatus.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(postSessionStatus.fulfilled, (state, action) => {
                state.error = null;
                state.response = action.payload;
                state.status = 'succeeded';
            })
            .addCase(postSessionStatus.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default sessionAcceptRejectSlice.reducer;


