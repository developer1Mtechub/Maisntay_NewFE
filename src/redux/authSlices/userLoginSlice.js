import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import makeRequest from '../../configs/makeRequest';

export const signInUser = createAsyncThunk(
    'userLogin/signInUser',
    async (credentials, { rejectWithValue }) => {
        try {
            // const response = await axios.post('https://jet-hunter.com/api/user/login/', credentials);
            // return response.data;
            const data = await makeRequest('POST', '/auth/sign-in', credentials);
            return data;
        } catch (error) {
            return error
        }
    }
);

const userLoginSlice = createSlice({
    name: 'userLogin',
    initialState: {
        user: null,
        error: null,
        token: null,
        role: null,
        user_name: null,
        tempAccessToken: null,
        status: 'idle',
        user_id: null
    },
    reducers: {
        resetState: (state, action) => {
            state.status = 'idle';
            state.token = action.payload.token;
            state.role = action.payload.role;
            state.user_name = action.payload.user_name;
            state.tempAccessToken = action.payload.tempAccessToken;
            state.user_id = action.payload.user_id;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signInUser.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(signInUser.fulfilled, (state, action) => {
                state.error = null;
                state.user = action.payload;
                state.role = action.payload.result?.user?.role;
                state.user_id = action.payload.result?.user?.id;
                state.tempAccessToken = action.payload.result?.accessToken;
                state.user_name = `${action.payload?.result?.user?.first_name} ${action.payload?.result?.user?.last_name}`;
                // if (action.payload.result?.user?.role === 'coachee' ||
                //     (action.payload.result?.user?.role === 'coach' &&
                //         action.payload.result?.user?.coach?.is_completed &&
                //         action.payload.result?.user?.coach?.is_stripe_completed)) {
                //     state.token = action.payload.result?.accessToken;
                // }

                if (action.payload.result?.user?.role === 'coachee') {
                    state.token = action.payload.result?.accessToken;
                }
                else if (action.payload.result?.user?.role === 'coach' &&
                    action.payload.result?.user?.coach?.is_completed === true &&
                    action.payload.result?.user?.coach?.is_stripe_completed === true) {
                    state.token = action.payload.result?.accessToken;
                }
                state.status = 'succeeded';
            })
            .addCase(signInUser.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});
export const { resetState } = userLoginSlice.actions;
export default userLoginSlice.reducer;
