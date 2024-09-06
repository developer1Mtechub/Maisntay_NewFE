// getSectionByCoachSlice.js.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import { BASE_URL } from '../../configs/apiUrl';
import { useSelector } from 'react-redux';
const initialState = {
    coachSections: {},
    status: 'idle',
    error: null,
};

export const fetchCoachSection = createAsyncThunk(
    'coachSection/fetchCoachSection',
    async (options, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().userLogin;
            const data = await makeRequest('GET', `/section/get-by-coach/${options.coachId}`, null, null, token);
            return data;
          } catch (error) {
            return error
          }
    }
);

const getSectionByCoachSlice = createSlice({
    name: 'coachSection',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoachSection.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCoachSection.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.coachSections = action.payload;
                state.error = null;
            })
            .addCase(fetchCoachSection.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default getSectionByCoachSlice.reducer;
