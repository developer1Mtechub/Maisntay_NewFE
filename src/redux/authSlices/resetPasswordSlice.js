// slices/emailVerificationSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const resetPassword = createAsyncThunk(
  'resetPassword/resetPassword',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await makeRequest('POST', '/auth/reset-password', payload);
      return data;
    } catch (error) {
      return error
    }
  }
);

const resetPasswordSlice = createSlice({
  name: 'resetPassword',
  initialState: {
    response: null,
    error: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetPassword.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.error = null;
        state.response = action.payload;
        state.status = 'succeeded';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      });
  },
});

export default resetPasswordSlice.reducer;


