// languageSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../configs/apiUrl';

// Define the initial state
const initialState = {
  coachingAreasList: [],
  status: 'idle',
  error: null,
};

// Define the async thunk to fetch languages from the API
export const fetchAreas = createAsyncThunk('coachingAreas/fetchAreas', async () => {
  const response = await axios.get(`${BASE_URL}/coach-area/get-all/`); // Replace with your API endpoint
  return response.data;
});

// Create the language slice
const areaSlice = createSlice({
  name: 'coachingAreas',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAreas.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAreas.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.coachingAreasList = action.payload;
      })
      .addCase(fetchAreas.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});


// Export the reducer
export default areaSlice.reducer;
