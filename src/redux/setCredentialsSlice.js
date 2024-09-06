import { createSlice } from '@reduxjs/toolkit';

const setCredentialsSlice = createSlice({
    name: 'credentials',
    initialState: {
        credentials: {},
    },
    reducers: {
        setCredentials: (state, action) => {
            state.credentials = action.payload;
        },
    },
});

export const { setCredentials } = setCredentialsSlice.actions;
export default setCredentialsSlice.reducer;