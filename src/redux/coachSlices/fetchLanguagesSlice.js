// languageSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import axios from 'axios'
import { BASE_URL } from '../../configs/apiUrl';

const initialState = {
  languages: [],
  status: 'idle',
  error: null,
};

// Define the async thunk to fetch languages from the API
export const fetchLanguages = createAsyncThunk('languages/fetchLanguages', async () => {
  const response = await axios.get(`${BASE_URL}/language/get-all`); // Replace with your API endpoint
  return response.data;
  // const data = await makeRequest('GET', '/language/get-all');
  // return data;
});

// Create the language slice
const languageSlice = createSlice({
  name: 'languages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLanguages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLanguages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.languages = action.payload;
      })
      .addCase(fetchLanguages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});


// Export the reducer
export default languageSlice.reducer;
