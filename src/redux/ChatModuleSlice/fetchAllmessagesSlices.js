// getCoachByAreaSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SOCKET_URL } from '../../configs/apiUrl';
const initialState = {
    messages: [],
    status: 'idle',
    error: null,
};

export const fetchMessages = createAsyncThunk(
    'messages/fetchMessages',
    async (options, { getState, rejectWithValue }) => {
        try {
            const response = await fetch(`${SOCKET_URL}/messages/${options?.sender_id}/${options?.receiver_id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch coaches');
            }
            const messagesResponse = await response.json();
            return messagesResponse;
        } catch (error) {
            return error;
        }
    }
);


const fetchAllMessagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.messages = action.payload
                state.error = null;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default fetchAllMessagesSlice.reducer;
