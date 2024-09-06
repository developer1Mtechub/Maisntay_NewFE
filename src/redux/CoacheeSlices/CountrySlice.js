// languageSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import axios from 'axios';
import { BASE_URL } from '../../configs/apiUrl';

const initialState = {
  countries: [],
  status: 'idle',
  error: null,
};

// Define the async thunk to fetch languages from the API
export const fetchCountries = createAsyncThunk('countries/fetchCountries', async () => {
  const response = await axios.get(`${BASE_URL}/country/get-all`); // Replace with your API endpoint
  return response.data;
  // const data = await makeRequest('GET', '/country/get-all');
  // console.log('data',data)
  // return data;
});

// Create the language slice
const countrySlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.countries = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});


// Export the reducer
export default countrySlice.reducer;
