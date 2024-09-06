// getSingleCoachDetailSlice.js.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import { BASE_URL } from '../../configs/apiUrl';
import { useSelector } from 'react-redux';
const initialState = {
    coachDetails: {},
    status: 'idle',
    error: null,
};

export const fetchCoachDetail = createAsyncThunk(
    'getCoachDetail/fetchCoachDetail',
    async (options, { getState, rejectWithValue }) => {

        try {
            const { token, role } = getState().userLogin;
            console.log('hullll', role, options.chatRole)
            const response = await fetch(`${BASE_URL}/users/getOneByRole/${options.coachId}?role=${options.chatRole || role}`, {
                headers: {
                    'Content-Type': 'application/json',
                    // Add your headers here, for example:
                    'Authorization': token,
                },
            });
            //console.log('response', response)
            if (!response.ok) {
                throw new Error('Failed to fetch coaches');
            }
            const coaches = await response.json();
            return coaches;
        } catch (error) {
            return error
        }
    }
);

const getSingleCoachDetailSlice = createSlice({
    name: 'getCoachDetail',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoachDetail.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCoachDetail.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.coachDetails = action.payload.user;
                state.error = null;
            })
            .addCase(fetchCoachDetail.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default getSingleCoachDetailSlice.reducer;
