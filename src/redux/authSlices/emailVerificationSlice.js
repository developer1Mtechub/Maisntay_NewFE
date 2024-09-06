import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";
import axios from "axios";
export const sendEmailVerification = createAsyncThunk(
  'emailVerification/sendEmailVerification',
  async (email, { rejectWithValue }) => {
    try {
      const data = await makeRequest('POST', '/auth/forget-password', email);
      return data;
    } catch (error) {
      return error
    }
  }
);

const emailVerificationSlice = createSlice({
  name: 'emailVerification',
  initialState: {
    user: null,
    error: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  },
  reducers: {
    resetState: (state, action) => {
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendEmailVerification.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(sendEmailVerification.fulfilled, (state, action) => {
        state.error = null;
        state.user = action.payload;
        state.status = 'succeeded';
      })
      .addCase(sendEmailVerification.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      });
  },
});
export const { resetState } = emailVerificationSlice.actions;
export default emailVerificationSlice.reducer;

