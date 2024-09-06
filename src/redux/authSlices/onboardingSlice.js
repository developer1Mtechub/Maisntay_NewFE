// onboardingSlice.js
import { createSlice } from '@reduxjs/toolkit';

const onboardingSlice = createSlice({
    name: 'onboarding',
    initialState: {
        isFirstLaunch: true,
    },
    reducers: {
        setFirstLaunch: (state, action) => {
            state.isFirstLaunch = action.payload;
        },
    },
});

export const { setFirstLaunch } = onboardingSlice.actions;
export const selectIsFirstLaunch = (state) => state.onboarding.isFirstLaunch;

export default onboardingSlice.reducer;
