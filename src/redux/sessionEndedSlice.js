import { createSlice } from '@reduxjs/toolkit';

const sessionEndedSlice = createSlice({
    name: 'sessionEnded',
    initialState: {
        sessionEnded: {},
    },
    reducers: {
        setSessionEnded: (state, action) => {
            state.sessionEnded = action.payload;
        },
    },
});

export const { setSessionEnded } = sessionEndedSlice.actions;
export default sessionEndedSlice.reducer;