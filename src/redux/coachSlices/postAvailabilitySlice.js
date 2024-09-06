import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const postAvailabilities = createAsyncThunk(
    'availability/postAvailabilities',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().userLogin
            const { signUpToken } = getState().setToken;
            console.log('check token', signUpToken)
            const data = await makeRequest('POST', '/section/create', payload, null, token != null ? token : signUpToken);
            return data;
        } catch (error) {
            return error
        }
    }
);

const postAvailabiltySlice = createSlice({
    name: 'availability',
    initialState: {
        response: null,
        error: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(postAvailabilities.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(postAvailabilities.fulfilled, (state, action) => {
                state.error = null;
                state.response = action.payload;
                state.status = 'succeeded';
            })
            .addCase(postAvailabilities.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default postAvailabiltySlice.reducer;


