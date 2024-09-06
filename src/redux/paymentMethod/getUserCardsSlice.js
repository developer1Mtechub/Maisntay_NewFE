import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import makeRequest from "../../configs/makeRequest";

export const fecthUserCards = createAsyncThunk(
    'userSavedCard/fecthUserCards',
    async (payload, { getState, rejectWithValue }) => {
        try {
            // const { signUpToken } = getState().setToken;
            const data = await makeRequest('GET', `/payments/get-user-cards/${payload?.user_id}`, null, null, null);
            return data;
        } catch (error) {
            return error;
        }
    }
);

const getUserCardsSlice = createSlice({
    name: 'userSavedCard',
    initialState: {
        cardsList: null,
        error: null,
        status: 'idle',
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fecthUserCards.pending, (state) => {
                state.error = null;
                state.status = 'loading';
            })
            .addCase(fecthUserCards.fulfilled, (state, action) => {
                state.error = null;
                state.cardsList = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fecthUserCards.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'failed';
            });
    },
});

export default getUserCardsSlice.reducer;


