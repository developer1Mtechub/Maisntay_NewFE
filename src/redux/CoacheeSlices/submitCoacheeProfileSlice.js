// slices/sendVerificationCodeSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const postCoacheeProfile = createAsyncThunk(
  'coacheeProfile/postCoacheeProfile',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().userLogin;
      const { signUpToken } = getState().setToken;
      //console.log('checkkkk',signUpToken, 'token', token)
      const data = await makeRequest('PUT', '/users/updateProfile', payload, null, token != null ? token : signUpToken);
      return data;
    } catch (error) {
      return error
    }
  }
);

const submitCoacheeProfileSlice = createSlice({
  name: 'coacheeProfile',
  initialState: {
    response: null,
    error: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(postCoacheeProfile.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(postCoacheeProfile.fulfilled, (state, action) => {
        state.error = null;
        state.response = action.payload;
        state.status = 'succeeded';
      })
      .addCase(postCoacheeProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      });
  },
});

export default submitCoacheeProfileSlice.reducer;


