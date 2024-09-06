// getCoachByAreaSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SOCKET_URL } from '../../configs/apiUrl';
const initialState = {
    contactsList: [],
    status: 'idle',
    error: null,
};

export const fetchContactList = createAsyncThunk(
    'contactsList/fetchContactList',
    async (options, { getState, rejectWithValue }) => {
        try {
            const response = await fetch(`${SOCKET_URL}/contacts/${options?.user_id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch coaches');
            }
            const contacts = await response.json();
            return contacts;
        } catch (error) {
            return error;
        }
    }
);


const fetchContactListSlice = createSlice({
    name: 'contactsList',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchContactList.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchContactList.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.contactsList = action.payload
                state.error = null;
            })
            .addCase(fetchContactList.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default fetchContactListSlice.reducer;
