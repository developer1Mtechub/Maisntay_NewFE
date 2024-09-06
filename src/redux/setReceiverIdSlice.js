import { createSlice } from '@reduxjs/toolkit';

const setReceiverIdSlice = createSlice({
    name: 'setReceiverId',
    initialState: {
        receiverId: {},
    },
    reducers: {
        setReceiverId: (state, action) => {
            state.receiverId = action.payload;
        },
    },
});

export const { setReceiverId } = setReceiverIdSlice.actions;
export default setReceiverIdSlice.reducer;