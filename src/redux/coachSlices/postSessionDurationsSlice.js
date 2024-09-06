import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const postSessionDurations = createAsyncThunk(
    'sessionDurations/postSessionDurations',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().userLogin
            const { signUpToken } = getState().setToken;
            console.log('signUpToken', signUpToken)
            console.log('token', token)
            // 'POST', '/duration/create'
            //'PUT', '/section/update'
            const data = await makeRequest('POST', '/duration/create', payload, null, token != null ? token : signUpToken);
            return data;
        } catch (error) {
            return error;
        }
    }
);

const postSessionDurationsSlice = createSlice({
    name: 'sessionDurations',
    initialState: {
        response: null,
        error: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(postSessionDurations.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(postSessionDurations.fulfilled, (state, action) => {
                state.error = null;
                state.response = action.payload;
                state.status = 'succeeded';
            })
            .addCase(postSessionDurations.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default postSessionDurationsSlice.reducer;


