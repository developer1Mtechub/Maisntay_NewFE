// slices/sendVerificationCodeSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const sendVerificationCode = createAsyncThunk(
  'sendVerificationCode/sendVerificationCode',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await makeRequest('POST', '/auth/code-verification', payload);
      return data;
    } catch (error) {
      return error
    }
  }
);

const sendVerificationCodeSlice = createSlice({
  name: 'sendVerificationCode',
  initialState: {
    response: null,
    error: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendVerificationCode.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(sendVerificationCode.fulfilled, (state, action) => {
        state.error = null;
        state.response = action.payload;
        state.status = 'succeeded';
      })
      .addCase(sendVerificationCode.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      });
  },
});

export default sendVerificationCodeSlice.reducer;


