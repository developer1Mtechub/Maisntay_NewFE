import { createSlice } from '@reduxjs/toolkit';

const setTokenSlice = createSlice({
    name: 'setToken',
    initialState: {
        signUpToken: null
    },
    reducers: {
        setSignUpToken: (state, action) => {
            state.signUpToken = action.payload;
        },
    },
});

export const { setSignUpToken } = setTokenSlice.actions;
export default setTokenSlice.reducer;
