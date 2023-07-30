import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import hospitalReducer from './slices/hospitalSlice';
import typeAccomodationReducer from './slices/typeAccomodationSlice';
import sectorReducer from './slices/sectorSlice';
import formBedReducer from './slices/formBedSlice';
import bedReducer from './slices/bedSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        hospital: hospitalReducer,
        typeAccomodation: typeAccomodationReducer,
        sector: sectorReducer,
        formBed: formBedReducer,
        bed: bedReducer
    },
})

export type RootState = ReturnType<typeof store.getState>;