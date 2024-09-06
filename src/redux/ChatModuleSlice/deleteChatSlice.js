import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";
import { SOCKET_URL } from "../../configs/apiUrl";


export const deleteChat = createAsyncThunk(
    'deleteChat/deleteChat',
    async (options, { rejectWithValue }) => {
        try {
            const response = await fetch(`${SOCKET_URL}/delete/${options?.sender_id}/${options?.receiver_id}`, {
                method: 'DELETE', // Specify the DELETE method
            });
            if (!response.ok) {
                throw new Error('Failed to delete Chat');
            }
            const deletedData = await response.json();
            return deletedData;
        } catch (error) {
            return error;
        }
    }
);

const deleteChatSlice = createSlice({
    name: 'deleteChat',
    initialState: {
        response: null,
        error: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(deleteChat.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(deleteChat.fulfilled, (state, action) => {
                state.error = null;
                state.response = action.payload;
                state.status = 'succeeded';
            })
            .addCase(deleteChat.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default deleteChatSlice.reducer;


