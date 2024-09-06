import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    user: null,
    status: 'idle',
    error: null,
};

export const fetchUserProfile = createAsyncThunk(
    'getUserProfile/fetchUserProfile',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { token, role } = getState().userLogin
            //console.log(token, role)
            const data = await makeRequest('GET', `/users/getOneByRole/${payload?.user_id}?role=${role !== null  ? role : payload?.role}`, null, null, token);
            return data;
        } catch (error) {
            if (error === 'Network not available.') {
                return rejectWithValue('Network not available.'); // will to for other as well.
            } else {
                return error;
            }
        }
    }
);


const getUserProfileSlice = createSlice({
    name: 'getUserProfile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
                state.error = null;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.error;
            });
    },
});

export default getUserProfileSlice.reducer;
