import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const postCoachProfile = createAsyncThunk(
  'coachProfile/postCoachProfile',
  async (payload, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().userLogin
      const data = await makeRequest('PUT', '/coach/update-profile', payload, null, token);
      return data;
    } catch (error) {
      return error
    }
  }
);

const submitCoachProfileSlice = createSlice({
  name: 'coachProfile',
  initialState: {
    response: null,
    error: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(postCoachProfile.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(postCoachProfile.fulfilled, (state, action) => {
        state.error = null;
        state.response = action.payload;
        state.status = 'succeeded';
      })
      .addCase(postCoachProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      });
  },
});

export default submitCoachProfileSlice.reducer;


