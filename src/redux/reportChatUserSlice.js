import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../configs/makeRequest";

export const reportUser = createAsyncThunk(
    'reportChatUser/reportUser',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().userLogin;
            const data = await makeRequest('POST', `/users/report`, payload, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const reportChatUserSlice = createSlice({
    name: 'reportChatUser',
    initialState: {
        response: null,
        error: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(reportUser.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(reportUser.fulfilled, (state, action) => {
                state.error = null;
                state.response = action.payload;
                state.status = 'succeeded';
            })
            .addCase(reportUser.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default reportChatUserSlice.reducer;


