import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
  user: null,
  status: 'idle',
  error: null,
};

export const registerUser = createAsyncThunk(
  'registerUser/registerUser',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await makeRequest('POST', '/auth/register', payload);
      return data;
    } catch (error) {
      return error;
    }
  }
);

// Create the user slice
const userRegisterSlice = createSlice({
  name: 'registerUser',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.error;
      });
  },
});

export default userRegisterSlice.reducer;
