import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import hospitalReducer from './slices/hospitalSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        hospital: hospitalReducer
    },
})

export type RootState = ReturnType<typeof store.getState>;