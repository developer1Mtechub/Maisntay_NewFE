import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    isConnected: true,
};

export const networkSlice = createSlice({
    name: 'network',
    initialState,
    reducers: {
        setConnected: (state, action) => {
            state.isConnected = action.payload;
        },
    },
});

export const { setConnected } = networkSlice.actions;
export default networkSlice.reducer;
