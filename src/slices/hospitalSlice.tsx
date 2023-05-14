//Redux
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
//Hooks
import useHospital from "../hooks/useHospital";
//Interfaces
import { IHospitalErrors, IHospital, IHospitalParams, IHospitalResponse } from "../interfaces/Hospital";
import { IAuth } from "../interfaces/Authentication";


interface IState {
    success: boolean | null,
    loading: boolean,
    errorMessage: string | null,
    errors: IHospitalErrors | null,
    hospitals: IHospital[]
};

const initialState: IState = {
    success: null,
    loading: false,
    errorMessage: null,
    errors: null,
    hospitals: []
};

export const register = createAsyncThunk(
    'hospital/register',
    async (data: IHospitalParams, { getState, rejectWithValue }) => {
        const userAuth:IAuth = (getState() as any).auth.userAuth;
        const response:IHospitalResponse = await useHospital().register({token: userAuth.access, data});

        if(response.success){
            if (Array.isArray(response.data)) { //Será necessário afirmar que response.data é um array, pois pode retornar unknown
                return (response.data[0] as IHospital);
            } else {
                throw new Error('Invalid response data');
            }
        } else {
            return rejectWithValue(response);
        }
    }
);

export const hospitalSlice = createSlice({
    name: 'hospital',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(register.fulfilled, (state: IState, action: PayloadAction<IHospital>)=>{
                state.success = true;
                state.loading = false;
                state.errorMessage = null;
                state.errors = null;
                state.hospitals.unshift(action.payload);
            })
            .addCase(register.pending, (state: IState)=>{
                state.loading = true;
            })
            .addCase(register.rejected, (state: IState, action: PayloadAction<IHospitalResponse | unknown>)=>{
                state.success = true;
                if(action.payload){
                    const response = (action.payload as IHospitalResponse);
                    state.errorMessage = response.message;
                    if(response.data){
                        state.errors = response.data as IHospitalErrors;
                    }
                }
                state.loading = false;
            })
    }
});

export default hospitalSlice.reducer;