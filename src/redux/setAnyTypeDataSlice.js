import { createSlice } from '@reduxjs/toolkit';

const setAnyTypeDataSlice = createSlice({
    name: 'anyData',
    initialState: {
        anyData: {},
        user_id: null
    },
    reducers: {
        setAnyData: (state, action) => {
            state.anyData = action.payload;
        },
        setUserId: (state, action) => {
            state.user_id = action.payload.user_id;
        },
    },
});

export const { setAnyData, setUserId } = setAnyTypeDataSlice.actions;
export default setAnyTypeDataSlice.reducer;
