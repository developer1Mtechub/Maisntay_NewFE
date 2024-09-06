import { createSlice } from '@reduxjs/toolkit';

const setSessionIdSlice = createSlice({
    name: 'setSessionId',
    initialState: {
        sessionId: {},
    },
    reducers: {
        setSessionId: (state, action) => {
            state.sessionId = action.payload;
        },
    },
});

export const { setSessionId } = setSessionIdSlice.actions;
export default setSessionIdSlice.reducer;
