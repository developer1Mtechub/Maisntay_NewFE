import { createSlice } from '@reduxjs/toolkit';

const setCategoryIdSlice = createSlice({
    name: 'categoryId',
    initialState: {
        categoryId: null,
    },
    reducers: {
        setCategoryId: (state, action) => {
            state.categoryId = action.payload;
        },
    },
});

export const { setCategoryId } = setCategoryIdSlice.actions;
export default setCategoryIdSlice.reducer;
