// getCoachByAreaSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
import { BASE_URL } from '../../configs/apiUrl';
const initialState = {
    coaches: [],
    status: 'idle',
    error: null,
    currentPage: 1,
    hasMore: true,
};

// export const fetchCoachByArea = createAsyncThunk(
//     'getCoachByArea/fetchCoachByArea',
//     async (options, { getState, rejectWithValue }) => {
//         try {
//             const { currentPage } = getState().getCoachByArea;
//             const response = await fetch(`${BASE_URL}/users/getByCoachArea?role=coach&coachingAreaId=${options.areaId}&pageSize=${options.pageSize}&page=${currentPage}`);
//             //console.log('response',JSON.stringify(response))
//             if (!response.ok) {
//                 throw new Error('Failed to fetch coaches');
//             }
//             const coaches = await response.json();
//             return coaches;
//         } catch (error) {
//             return rejectWithValue(error.message);
//         }
//     }
// );

export const fetchCoachByArea = createAsyncThunk(
    'getCoachByArea/fetchCoachByArea',
    async (options, { getState, rejectWithValue }) => {
        try {
            const { currentPage } = getState().getCoachByArea;
            const data = makeRequest('GET', `/users/getByCoachArea?role=coach&coachingAreaId=${options.areaId}&pageSize=${options.pageSize}&page=${currentPage}`, null, null, null)
            return data;
        } catch (error) {
            return error;
        }
    }
);

const getCoachByAreaSlice = createSlice({
    name: 'getCoachByArea',
    initialState,
    reducers: {
        resetState: (state, action) => {
            state.status = 'idle';
            state.currentPage = 1;
            state.coaches = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoachByArea.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCoachByArea.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const newCoaches = Array.isArray(action.payload) ? action.payload : [];
                state.coaches = state.coaches.concat(action.payload.data || action.payload.coach);
                state.currentPage += 1;
                state.hasMore = newCoaches.length > 0; // If no more data, set hasMore to false
                state.error = null;
            })
            .addCase(fetchCoachByArea.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});
export const { resetState } = getCoachByAreaSlice.actions;
export default getCoachByAreaSlice.reducer;
