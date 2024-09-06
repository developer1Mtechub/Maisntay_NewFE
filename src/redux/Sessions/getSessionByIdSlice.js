import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const fetchSessionDetailById = createAsyncThunk(
    'sessionDetailById/fetchSessionDetailById',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().userLogin;
            const data = await makeRequest('GET', `/session/get/${payload?.sessionId}`, null, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const getSessionByIdSlice = createSlice({
    name: 'sessionDetailById',
    initialState: {
        response: null,
        error: null,
        status: 'idle',
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSessionDetailById.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(fetchSessionDetailById.fulfilled, (state, action) => {
                state.error = null;
                state.response = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchSessionDetailById.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default getSessionByIdSlice.reducer;


